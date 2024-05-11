import supertest from 'supertest'
import { BASE_PATH } from '../src/config.js'
import app from '../src/server.js';
import { handleTestUserLogin, user1Credentials, user2Credentials } from './utils.js'

const agent = supertest.agent(app);

describe('Create post', () => {
  const path = 'posts'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('If message is missing from body', () => {
    it('should respond with 400 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        message: '',
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(400)
    });
  })
  describe('If message is provided in body', () => {
    it('should respond with 201 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        message: 'Hello, World!',
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.body.data.message).toBe('Hello, World!')
      expect(response.body).toHaveProperty('data.id')
      expect(response.body).toHaveProperty('data.author_id')
      expect(response.body).toHaveProperty('data.created')
      expect(response.statusCode).toBe(201)
    });
  })
})

describe('Get post', () => {
  const path = 'posts'
  describe('Given an invalid post id', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/${path}/id_of_non_existing_post`)
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given a valid post id', () => {
    it('should respond with 200 status code', async () => {
      const createPostResponse = await agent.post(`${BASE_PATH}/${path}`).send({
        message: 'Hello, Houston!!!',
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const { id } = createPostResponse.body.data
      const response = await agent.get(`${BASE_PATH}/${path}/${id}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data.id')
      expect(response.body).toHaveProperty('data.message')
      expect(response.body).toHaveProperty('data.created')
      expect(response.body).toHaveProperty('data.author_id')
      expect(response.body).toHaveProperty('data.author_username')
      expect(response.body).toHaveProperty('data.author_displayName')
      expect(response.body).toHaveProperty('data.author_avatar_url')
    });
  })
})

describe('delete post', () => {
  const path = 'posts'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.delete(`${BASE_PATH}/${path}/hsajdasdmasd`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given an invalid post id', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.delete(`${BASE_PATH}/${path}/id_of_non_existing_post`).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given a valid post id', () => {
    describe('If post is not authored by current user i.e user1', () => {
      it('should respond with 403 status code', async () => {
        const createPostByUser2Response = await agent.post(`${BASE_PATH}/${path}`).send({
          message: 'This is user2\'s post!!!',
        }).set('Cookie', await handleTestUserLogin(user2Credentials))
        const { id } = createPostByUser2Response.body.data
        // user1 attempts to delete user2's post
        const response = await agent.delete(`${BASE_PATH}/${path}/${id}`).set('Cookie', await handleTestUserLogin(user1Credentials))
        expect(response.statusCode).toBe(403)
      });
    })
    describe('If post is successfully deleted', () => {
      it('should respond with 200 status code', async () => {
        const createPostResponse = await agent.post(`${BASE_PATH}/${path}`).send({
          message: 'This is my post!!!',
        }).set('Cookie', await handleTestUserLogin(user1Credentials))
        const { id } = createPostResponse.body.data
        const response = await agent.delete(`${BASE_PATH}/${path}/${id}`).set('Cookie', await handleTestUserLogin(user1Credentials))
        expect(response.statusCode).toBe(200)
      });
    })
  })
})