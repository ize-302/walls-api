const request = require('supertest')
const { BASE_PATH } = require('../config')
const app = require('../server');

const { generateUsername } = require("unique-username-generator");
const { handleSetCookie } = require('./auth');

const newusername = generateUsername("-", 2, 20, 'testuser'); // https://npmjs.com/package/unique-username-generator

const existing_username = 'testuser-humanist18'

const changeUsernameTests = () => {
  const path = 'settings/change-username'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('No username is provided', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`).send({
        username: '',
      }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given an invalid username', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`).send({
        username: '@33fm334',
      }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given a username that already exists', () => {
    it('should respond with 409 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`).send({
        username: existing_username,
      }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(409)
    });
  })
  describe('Given an valid username and that has not been taken', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`).send({
        username: newusername,
      }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(200)
    });
  })
}

const changePasswordTests = () => {
  const path = 'settings/change-password'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('When one of or both current password and new password is missing', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        currentPassword: '',
        newPassword: '',
      }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given incorrect current password', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        currentPassword: 'password1235',
        newPassword: 'password1234'
      }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given both current password and new password', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        currentPassword: 'password1234',
        newPassword: 'password1234'
      }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(200)
    });
  })
}

module.exports = { changeUsernameTests, changePasswordTests }