import request from 'supertest'
import { BASE_PATH } from '../config.js'
import app from '../server.js';
import { handleTestUserLogin, user1Credentials, user2Credentials } from './utils.js'

export const getUserProfileTests = () => {
  const path = `users/user2`
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/users/test--non-existing-user`)
      expect(response.statusCode).toBe(404)
    });
  });
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data.id')
      expect(response.body).toHaveProperty('data.username')
      expect(response.body).toHaveProperty('data.email')
      expect(response.body).toHaveProperty('data.displayName')
      expect(response.body).toHaveProperty('data.bio')
      expect(response.body).toHaveProperty('data.gender')
      expect(response.body).toHaveProperty('data.avatar_url')
    });
  });
}

export const getUserStatsTests = () => {
  const path = `users/user2/stats`
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/users/test--non-existing-user/stats`)
      expect(response.statusCode).toBe(404)
    });
  });
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data.posts')
      expect(response.body).toHaveProperty('data.likes')
      expect(response.body).toHaveProperty('data.following')
      expect(response.body).toHaveProperty('data.followers')
    });
  });
}

export const getUserFollowersListTests = () => {
  const path = `users/user2/followers`
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body.data.items)).toBe(true)
    });
  });
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/users/test--non-existing-user/followers`)
      expect(response.statusCode).toBe(404)
    });
  });
}

export const getUserFollowingListTests = () => {
  const path = `users/user2/following`
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body.data.items)).toBe(true)
    });
  });
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/users/test--non-existing-user/following`)
      expect(response.statusCode).toBe(404)
    });
  });
}

export const handleUserFollowTests = () => {
  const path = 'users/follow'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('If user does not exists', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': 'non-existing-user' }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
  describe('If user tries to follow self', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': 'user1' }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(400)
    });
  })
  describe('If successfuly followed user', () => {
    it('should respond with 200 status code', async () => {
      const currentUserPreviousStats = await request(app).get(`${BASE_PATH}/users/user1/stats`)
      const targetUserPreviousStats = await request(app).get(`${BASE_PATH}/users/user2/stats`)
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': user2Credentials.username }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const currentUserUpdatedStats = await request(app).get(`${BASE_PATH}/users/user1/stats`)
      const targetUserUpdatedStats = await request(app).get(`${BASE_PATH}/users/user2/stats`)
      // assert current user followingcount is incremented
      expect(currentUserUpdatedStats.body.data.following).toBeGreaterThan(currentUserPreviousStats.body.data.following)
      // assert target user followers count is incremented
      expect(targetUserUpdatedStats.body.data.followers).toBeGreaterThan(targetUserPreviousStats.body.data.followers)
      expect(response.statusCode).toBe(200)
    });
  })
  describe('If following user already', () => {
    it('should respond with 409 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': user2Credentials.username }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(409)
    });
  })
}

export const handleUserUnfollowTests = () => {
  const path = 'users/unfollow'
  describe('Returns error if session isnt provided', () => {
    it('should respond with 401 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(401)
    });
  })
  describe('If user does not exists', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': 'non-exising-user' }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
  describe('If successfully unfollowed user', () => {
    it('should respond with 200 status code', async () => {
      const currentUserPreviousStats = await request(app).get(`${BASE_PATH}/users/user1/stats`)
      const targetUserPreviousStats = await request(app).get(`${BASE_PATH}/users/user2/stats`)
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': user2Credentials.username }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const currentUserUpdatedStats = await request(app).get(`${BASE_PATH}/users/user1/stats`)
      const targetUserUpdatedStats = await request(app).get(`${BASE_PATH}/users/user2/stats`)
      // assert current user followingcount is decreased
      expect(currentUserUpdatedStats.body.data.following).toBeLessThan(currentUserPreviousStats.body.data.following)
      // assert target user followers count is decreased
      expect(targetUserUpdatedStats.body.data.followers).toBeLessThan(targetUserPreviousStats.body.data.followers)
      expect(response.statusCode).toBe(200)
    });
  })
  describe('If not following user originally', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': user2Credentials.username }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
}
