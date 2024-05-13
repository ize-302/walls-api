import supertest from 'supertest'
import { BASE_PATH } from '../src/config.js'
import app from '../src/server.js';
import { handleTestUserLogin, user1Credentials, user2Credentials } from './utils.js'

const agent = supertest.agent(app);

describe('Create reply', () => {
  const path = 'replies'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given an invalid parent_id', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/posts/id_of_non_existing_post`).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
  describe('If message / parent_id is missing from body', () => {
    it('should respond with 400 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        message: '',
        parent_id: ''
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(400)
    });
  })
  describe('If message / parent_id is provided in body', () => {
    it('should respond with 201 status code', async () => {
      // create a parent post
      const createPostResponse = await agent.post(`${BASE_PATH}/posts`).send({
        message: 'Post created to test reply',
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const { id } = createPostResponse.body.data
      // reply to newly created post
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        message: 'This is a reply',
        parent_id: id
      }).set('Cookie', await handleTestUserLogin(user2Credentials))
      expect(response.body.data.message).toBe('This is a reply')
      expect(response.body).toHaveProperty('data.id')
      expect(response.body).toHaveProperty('data.author_id')
      expect(response.body).toHaveProperty('data.created')
      expect(response.body).toHaveProperty('data.parent_id')
      expect(response.statusCode).toBe(201)
    });
  })
})

describe('Get reply', () => {
  const path = 'replies'
  describe('Given an invalid reply id', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/${path}/id_of_non_existing_post`)
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given a valid reply id', () => {
    it('should respond with 200 status code', async () => {
      // create a parent post
      const createPostResponse = await agent.post(`${BASE_PATH}/posts`).send({
        message: 'Post created to test reply',
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const { id: newPostId } = createPostResponse.body.data
      // create a reply
      const createReplyResponse = await agent.post(`${BASE_PATH}/${path}`).send({
        message: 'Hello, Houston!!!',
        parent_id: newPostId
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const { id } = createReplyResponse.body.data
      const response = await agent.get(`${BASE_PATH}/${path}/${id}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data.id')
      expect(response.body).toHaveProperty('data.message')
      expect(response.body).toHaveProperty('data.created')
      expect(response.body).toHaveProperty('data.author_id')
      expect(response.body).toHaveProperty('data.author_username')
      expect(response.body).toHaveProperty('data.author_displayName')
      expect(response.body).toHaveProperty('data.author_avatar_url')
      expect(response.body).toHaveProperty('data.likesCount')
      expect(response.body).toHaveProperty('data.commentsCount')
      expect(response.body).toHaveProperty('data.currentUserLiked')
    });
  })
})

describe('delete reply', () => {
  const path = 'replies'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.delete(`${BASE_PATH}/${path}/hsajdasdmasd`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given an invalid reply id', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.delete(`${BASE_PATH}/${path}/id_of_non_existing_post`).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given a valid reply id', () => {
    describe('If reply is not authored by current user i.e user1', () => {
      it('should respond with 403 status code', async () => {
        // create post
        const createPostResponse = await agent.post(`${BASE_PATH}/posts`).send({
          message: 'Post created to test reply',
        }).set('Cookie', await handleTestUserLogin(user1Credentials))
        const { id: newPostId } = createPostResponse.body.data
        // create reply
        const createReplyByUser2Response = await agent.post(`${BASE_PATH}/${path}`).send({
          message: 'This is user2\'s post!!!',
          parent_id: newPostId
        }).set('Cookie', await handleTestUserLogin(user2Credentials))
        const { id: newReplyId } = createReplyByUser2Response.body.data
        // user1 attempts to delete user2's post
        const response = await agent.delete(`${BASE_PATH}/${path}/${newReplyId}`).set('Cookie', await handleTestUserLogin(user1Credentials))
        expect(response.statusCode).toBe(403)
      });
    })
    describe('If reply is successfully deleted', () => {
      it('should respond with 200 status code', async () => {
        // create post
        const createPostResponse = await agent.post(`${BASE_PATH}/posts`).send({
          message: 'Post created to test reply',
        }).set('Cookie', await handleTestUserLogin(user1Credentials))
        const { id: newPostId } = createPostResponse.body.data
        // create reply
        const createReplyResponse = await agent.post(`${BASE_PATH}/${path}`).send({
          message: 'This is my reply!!!',
          parent_id: newPostId
        }).set('Cookie', await handleTestUserLogin(user1Credentials))
        const { id } = createReplyResponse.body.data
        const response = await agent.delete(`${BASE_PATH}/${path}/${id}`).set('Cookie', await handleTestUserLogin(user1Credentials))
        expect(response.statusCode).toBe(200)
      });
    })
  })
})