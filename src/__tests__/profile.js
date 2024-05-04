import request from 'supertest'
import { BASE_PATH } from '../config.js'
import app from '../server.js';
import { handleSetCookie } from './utils.js'

export const getCurrentProfileTests = () => {
  const path = 'profile/me'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Returns the current profile', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(200)
    });
  })
}

export const updateCurrentProfileTests = () => {
  const path = 'profile/update'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given nullable (filled or not) data of email, gender, name, bio', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`).send({
        email: '',
        gender: '',
        name: '',
        bio: ''
      }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(200)
    });
  })
}
