import request from 'supertest'
import { BASE_PATH } from '../config.js'
import app from '../server.js';
import { existing_user_id, handleSetCookie } from './utils.js'

export const getUserProfile = () => {
  const path = `users/${existing_user_id}`
  describe('Given a valid user id', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
    });
  });
  describe('Given a invalid user id', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(404)
    });
  });
}

export const handleUserFollow = () => {
  const path = 'users/follow'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('If user does not exists', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}?target=non_existing_user_id`).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(404)
    });
  })
  describe('If not following user', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}?target=${existing_user_id}`).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(200)
    });
  })
  describe('If following user already', () => {
    it('should respond with 409 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}?target=${existing_user_id}`).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(409)
    });
  })
}

export const handleUserUnfollow = () => {
  const path = 'users/unfollow'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).put(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('If user does not exists', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}?target=non_existing_user_id`).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(404)
    });
  })
  describe('If following user', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}?target=${existing_user_id}`).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(200)
    });
  })
  describe('If not following user already', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}?target=${existing_user_id}`).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(404)
    });
  })
}
