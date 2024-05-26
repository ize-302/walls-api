import supertest from 'supertest'
import { BASE_PATH } from '../src/config.js'
import app from '../src/server.js';
import { handleTestUserLogin, user1Credentials, user2Credentials } from './utils.js'

const agent = supertest.agent(app);

describe('Like an post', () => {
  const path = 'likes'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given incorrect or missing type / postId', () => {
    it('should respond with 400 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        type: 'postay',
        postId: ''
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given non-existing postId', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        type: 'REPLY',
        postId: 'fake-post-id'
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given correct type / postId', () => {
    it('should respond with 201 status code', async () => {
      // create post
      const createPostResponse = await agent.post(`${BASE_PATH}/posts`).send({
        message: 'Post created to test liking an post',
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const { id: newPostId } = createPostResponse.body.data
      // like the newly created post
      const response = await agent.post(`${BASE_PATH}/${path}`).send({
        type: 'POST',
        postId: newPostId
      }).set('Cookie', await handleTestUserLogin(user2Credentials))
      expect(response.statusCode).toBe(201)
    });
  })
})

describe('Unlike an post', () => {
  const path = 'likes'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.delete(`${BASE_PATH}/${path}/post-id-here`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('Given non-existing postId', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.delete(`${BASE_PATH}/${path}/fake-post-id`).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given correct postId', () => {
    it('should respond with 204 status code', async () => {
      // create post
      const createPostResponse = await agent.post(`${BASE_PATH}/posts`).send({
        message: 'Post created to test liking an post',
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const { id: newPostId } = createPostResponse.body.data
      // like the newly created post
      await agent.post(`${BASE_PATH}/${path}`).send({
        type: 'POST',
        postId: newPostId
      }).set('Cookie', await handleTestUserLogin(user2Credentials))
      // unlike newly created post
      const response = await agent.delete(`${BASE_PATH}/${path}/${newPostId}`).set('Cookie', await handleTestUserLogin(user2Credentials))
      expect(response.statusCode).toBe(200)
    });
  })
})

describe('Get list of users that liked an post', () => {
  const path = 'likes'
  describe('Given a valid post id', () => {
    it('should respond with 200 status code', async () => {
      const createPostResponse = await agent.post(`${BASE_PATH}/posts`).send({
        message: 'New post, who dis?',
      }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const { id: newPostId } = createPostResponse.body.data
      // like the newly created post
      await agent.post(`${BASE_PATH}/${path}`).send({
        type: 'POST',
        postId: newPostId
      }).set('Cookie', await handleTestUserLogin(user2Credentials))
      // fetch users that have liked post
      const response = await agent.get(`${BASE_PATH}/${path}/${newPostId}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data.items')
    });
  })
});