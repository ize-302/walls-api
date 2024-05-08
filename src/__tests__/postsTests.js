import request from 'supertest'
import { BASE_PATH } from '../config.js'
import app from '../server.js';
import { handleSetCookie } from './utils.js'

let data = ''

export const createPostTests = () => {
  const path = 'posts'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('If message is missing from body', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        message: '',
      }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(400)
    });
  })
  describe('If message is provided in body', () => {
    it('should respond with 201 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).send({
        message: 'Hello, World',
      }).set('Cookie', await handleSetCookie())
      data = response
      expect(response.statusCode).toBe(201)
    });
  })
}

export const getPostTests = () => {
  const path = 'posts/qpbslwyxaf8zvih7t6dcl883'
  describe('Given an invalid post id', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/posts/id_of_non_existing_post`)
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given a valid post id', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
    });
  })
}

export const deletePostTests = () => {
  const path = 'posts/qpbslwyxaf8zvih7t6dcl883'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).delete(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given an invalid post id', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).delete(`${BASE_PATH}/posts/id_of_non_existing_post`).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given a valid post id', () => {
    describe('If post is not authored by current user', () => {
      it('should respond with 403 status code', async () => {
        const response = await request(app).delete(`${BASE_PATH}/${path}`).set('Cookie', await handleSetCookie())
        expect(response.statusCode).toBe(403)
      });
    })
    describe('If post is successfully deleted', () => {
      it('should respond with 200 status code', async () => {
        const response = await request(app).delete(`${BASE_PATH}/${path}`).set('Cookie', await handleSetCookie())
        expect(response.statusCode).toBe(200)
      });
    })
  })
}