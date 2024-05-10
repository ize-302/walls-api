import supertest from 'supertest'
import { BASE_PATH } from '../config.js'
import app from '../server.js';
import { handleTestUserLogin, user1Credentials } from './utils.js'

const agent = supertest.agent(app);

export const getCurrentProfileTests = () => {
  const path = 'profile/me'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Returns the current profile', () => {
    it('should respond with 200 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/${path}`).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data.id')
      expect(response.body).toHaveProperty('data.username')
      expect(response.body).toHaveProperty('data.email')
      expect(response.body).toHaveProperty('data.displayName')
      expect(response.body).toHaveProperty('data.bio')
      expect(response.body).toHaveProperty('data.gender')
      expect(response.body).toHaveProperty('data.avatar_url')
    });
  })
}

export const updateCurrentProfileTests = () => {
  const path = 'profile/update'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.put(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given nullable (filled or not) data of email, gender, displayName, bio', () => {
    it('should respond with 200 status code', async () => {
      const response = await agent.put(`${BASE_PATH}/${path}`).send({
        email: 'user1@mail.com',
        gender: 'male',
        displayName: 'User One',
        bio: 'An elite test subject'
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(200)
      expect(response.body.data.email).toBe('user1@mail.com')
      expect(response.body.data.gender).toBe('male')
      expect(response.body.data.displayName).toBe('User One')
      expect(response.body.data.bio).toBe('An elite test subject')
    });
  })
}
