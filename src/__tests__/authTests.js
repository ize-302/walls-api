import request from 'supertest'
import { BASE_PATH } from '../config.js'
import app from '../server.js';
import { username, loginCredentials, existing_username } from './utils.js'

export const signupTests = () => {
  const path = 'register'
  describe('Given neither username nor password', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: '',
        password: ''
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given username without password', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: username,
        password: ''
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given password without username', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: '',
        password: 'password1234'
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given invalid username', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: '*304jdj',
        password: 'password1234'
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given a valid username and password', () => {
    it('should successfully create user and respond with 201 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: username,
        password: 'password1234'
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(201)
    });
  });
  describe('Given a username that has already been used', () => {
    it('should respond with 409 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: existing_username,
        password: 'password1234'
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(409)
    });
  });
}


export const loginTests = () => {
  const path = 'login'
  describe('Given neither username nor password', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: '',
        password: ''
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given an incorrect username or password', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: 'wrong-username',
        password: 'password1235' // wrong password here
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given a correct username and password', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send(loginCredentials)
      expect(response.statusCode).toBe(200)
    });
    it('should have cookies saved to headers', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send(loginCredentials)
      const cookies = response.headers['set-cookie'];
      const authCookie = cookies.find(cookie => cookie.includes('connect.sid'));
      expect(authCookie).toBeTruthy();
    });
  })
}

export const logoutTests = () => {
  const path = 'logout'
  describe('Logout user', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
    });
    it('should not have cookies saved', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`)
      const cookies = !response.headers['set-cookie'];
      expect(cookies).toBeTruthy();
    });
  })
}
