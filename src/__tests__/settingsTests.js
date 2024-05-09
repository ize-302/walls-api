import request from 'supertest'
import { BASE_PATH } from '../config.js'
import app from '../server.js';
import { handleTestUserLogin, user1Credentials, user2Credentials } from './utils.js'

const newUsername = 'user_1'
const newPassword = 'newPassword1234'

export const changeUsernameTests = () => {
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
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given an invalid username', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`).send({
        username: 'user 1',
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given a username that already exists', () => {
    it('should respond with 409 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`).send({
        username: user2Credentials.username,
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(409)
    });
  })
  describe('Given a valid username and that has not been taken', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`).send({
        username: newUsername,
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(200)
      expect(response.body.data.username).toBe(newUsername)
    });
  })
}

export const changePasswordTests = () => {
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
      }).set('Cookie', await handleTestUserLogin({ ...user1Credentials, username: newUsername }))
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given incorrect current password', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        currentPassword: 'password1235',
        newPassword: newPassword
      }).set('Cookie', await handleTestUserLogin({ ...user1Credentials, username: newUsername }))
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given both current password and new password', () => {
    it('should respond with 200 status code', async () => {
      const changePasswordResponse = await request(app).post(`${BASE_PATH}/${path}`).send({
        currentPassword: user1Credentials.password,
        newPassword: newPassword
      }).set('Cookie', await handleTestUserLogin({ ...user1Credentials, username: newUsername }))
      expect(changePasswordResponse.statusCode).toBe(200)
      // assert new password works
      const loginResponse = await request(app).post(`${BASE_PATH}/login`).send({ username: newUsername, password: newPassword })
      expect(loginResponse.statusCode).toBe(200)
    });
  })
}
