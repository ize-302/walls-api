const request = require('supertest')
const { BASE_PATH } = require('../config')
const app = require('../server');

const { generateUsername } = require("unique-username-generator");

const username = generateUsername("-", 2, 20, 'testuser'); // https://npmjs.com/package/unique-username-generator

const signupTests = () => {
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
        username: username,
        password: 'password1234'
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(409)
    });
  });
}

const loginCredentials = {
  username: username,
  password: 'password1234'
}

const loginTests = () => {
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

const handleSetCookie = async () => {
  const login_response = await request(app).post(`${BASE_PATH}/login`).send(loginCredentials)
  const cookies = login_response.headers['set-cookie'];
  const authCookie = cookies.find(cookie => cookie.includes('connect.sid'));
  return authCookie
}

module.exports = { signupTests, loginTests, handleSetCookie }