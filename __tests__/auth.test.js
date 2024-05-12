import supertest from 'supertest'
import { BASE_PATH } from '../src/config.js'
import app from '../src/server.js';
import { user1Credentials, user2Credentials, handleTestUserLogin } from './utils.js'

const agent = supertest.agent(app);


describe('Sign up', () => {
  const path = 'register'
  describe('Given neither username nor password', () => {
    it('should respond with 400 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        username: '',
        password: ''
      })
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given username without password', () => {
    it('should respond with 400 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        username: user1Credentials.username,
        password: ''
      })
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given password without username', () => {
    it('should respond with 400 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        username: '',
        password: 'password1234'
      })
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given invalid username', () => {
    it('should respond with 400 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        username: '*304jdj',
        password: 'password1234'
      })
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given a username that has already been used', () => {
    it('should respond with 409 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send(user2Credentials)
      expect(response.statusCode).toBe(409)
    });
  });
  describe('Given a valid username and password', () => {
    it('should successfully create user and respond with 201 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send(user1Credentials)
      expect(response.statusCode).toBe(201)
    });
  });
})

describe('Login', () => {
  const path = 'login'
  describe('Given neither username nor password', () => {
    it('should respond with 400 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        username: '',
        password: ''
      })
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given an incorrect username or password', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        username: 'wrong-username',
        password: '**snss**'
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given a correct username and password', () => {
    it('should respond with 200 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send(user1Credentials)
      expect(response.statusCode).toBe(200)
    });
    it('should have cookies saved to headers', async () => {
      const authCookie = await handleTestUserLogin(user1Credentials)
      expect(authCookie).toBeTruthy();
    });
  })
})

describe('Logout', () => {
  const path = 'logout'
  describe('Logout user', () => {
    it('should respond with 200 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
    });
    it('should not have cookies saved', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`)
      const cookies = await !response.headers['set-cookie'];
      expect(cookies).toBeTruthy();
    });
  })
})