import request from 'supertest'
import { BASE_PATH } from '../config.js'
import app from '../server.js';
import { existing_username, handleSetCookie, username } from './utils.js'

export const getUserProfileTests = () => {
  const path = `users/${existing_username}`
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
    });
  });
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/users/test--non-existing-user`)
      expect(response.statusCode).toBe(404)
    });
  });
}

export const getUserStatsTests = () => {
  const path = `users/${existing_username}/stats`
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
    });
  });
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/users/test--non-existing-user/stats`)
      expect(response.statusCode).toBe(404)
    });
  });
}

export const getUserFollowersListTests = () => {
  const path = `users/${existing_username}/followers`
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/users/test--non-existing-user/followers`)
      expect(response.statusCode).toBe(404)
    });
  });
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
    });
  });
}

export const getUserFollowingListTests = () => {
  const path = `users/${existing_username}/following`
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/users/test--non-existing-user/following`)
      expect(response.statusCode).toBe(404)
    });
  });
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
    });
  });
}


// NOTE: CLEAR FOLLOWS TABLE FOR FOLLOW/UNFOLLOW CASES TO WORK WELL ⚠
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
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': '404' }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(404)
    });
  })
  describe('If user tries to follow self', () => {
    it('should respond with 400 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': username }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(400)
    });
  })
  describe('If successfuly followed user', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': existing_username }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(200)
    });
  })
  describe('If following user already', () => {
    it('should respond with 409 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': existing_username }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(409)
    });
  })
}

// NOTE: CLEAR FOLLOWS TABLE FOR FOLLOW/UNFOLLOW CASES TO WORK WELL ⚠
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
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': '404' }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(404)
    });
  })
  describe('If successfully unfollowed user', () => {
    it('should respond with 200 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': existing_username }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(200)
    });
  })
  describe('If not following user originally', () => {
    it('should respond with 404 status code', async () => {
      const response = await request(app).post(`${BASE_PATH}/${path}`).query({ 'username': existing_username }).set('Cookie', await handleSetCookie())
      expect(response.statusCode).toBe(404)
    });
  })
}