const request = require('supertest')
const { BASE_PATH } = require('../config')
const app = require('../server');

const { generateUsername } = require("unique-username-generator");

const username = generateUsername("-", 2, 20, 'testuser'); // https://npmjs.com/package/unique-username-generator

describe('create a new user', () => {
  const path = 'auth/register'
  describe('When username or password is missing', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: '',
        password: ''
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(400)
    });
  })
  describe('When invalid username is provided', () => {
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
});


describe('log in', () => {
  const path = 'auth/login'
  describe('When username or password is incorrect', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: username,
        password: 'password1235' // wrong password here
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(401)
    });
  })
  describe('When username and password is correct', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        username: username,
        password: 'password1234'
      }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(200)
    });
  })
})