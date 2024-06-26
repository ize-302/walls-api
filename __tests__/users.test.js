import supertest from 'supertest'
import { BASE_PATH } from '../src/config.js'
import app from '../src/server.js';
import { handleTestUserLogin, user1Credentials, user2Credentials } from './utils.js'

const agent = supertest.agent(app);

describe('users/:user', () => {
  const path = `users/user2`
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/users/test--non-existing-user`)
      expect(response.statusCode).toBe(404)
    });
  });
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data.id')
      expect(response.body).toHaveProperty('data.username')
      expect(response.body).toHaveProperty('data.email')
      expect(response.body).toHaveProperty('data.displayName')
      expect(response.body).toHaveProperty('data.bio')
      expect(response.body).toHaveProperty('data.gender')
      expect(response.body).toHaveProperty('data.avatar_url')
      expect(response.body).toHaveProperty('data.postsCount')
      expect(response.body).toHaveProperty('data.likesCount')
      expect(response.body).toHaveProperty('data.followingCount')
      expect(response.body).toHaveProperty('data.followersCount')
      expect(response.body).toHaveProperty('data.currentUserIsFollower')
      expect(response.body).toHaveProperty('data.isFollowingCurrentUser')
    });
  });
})

describe('user followers', () => {
  const path = `users/user2/followers`
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body.data.items)).toBe(true)
    });
  });
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/users/test--non-existing-user/followers`)
      expect(response.statusCode).toBe(404)
    });
  });
})

describe('user followings', () => {
  const path = `users/user2/following`
  describe('Given a valid username', () => {
    it('should respond with 200 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body.data.items)).toBe(true)
    });
  });
  describe('Given an invalid username', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/users/test--non-existing-user/following`)
      expect(response.statusCode).toBe(404)
    });
  });
})


describe('Follow user', () => {
  const path = 'users/follow'
  describe('Given an unauthorised user attempts to follow', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).query({ 'username': user2Credentials.username })
      expect(response.statusCode).toBe(401)
    });
  })
  describe('given user does not exists', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).query({ 'username': 'non-exising-user' }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
  describe('given current user tries to follow self', () => {
    it('should respond with 400 status code', async () => {
      const response = await agent.post(`${BASE_PATH}/${path}`).query({ 'username': 'user1' }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(400)
    });
  })
  describe('Given current user attempts to follow valid user', () => {
    it('should respond with 200 status code', async () => {
      const currentUserPreviousDetail = await agent.get(`${BASE_PATH}/profile/me`).set('Cookie', await handleTestUserLogin(user1Credentials))
      const targetUserPreviousDetail = await agent.get(`${BASE_PATH}/users/user2`)
      const toggleUserFollowResponse = await agent.post(`${BASE_PATH}/${path}`).query({ 'username': user2Credentials.username }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const currentUserUpdatedDetail = await agent.get(`${BASE_PATH}/profile/me`).set('Cookie', await handleTestUserLogin(user1Credentials))
      const targetUserUpdatedDetail = await agent.get(`${BASE_PATH}/users/user2`)

      // assert current user followingcount is incremented
      expect(currentUserUpdatedDetail.body.data.followingCount).toBeGreaterThan(currentUserPreviousDetail.body.data.followingCount)
      // assert target user followers count is incremented
      expect(targetUserUpdatedDetail.body.data.followersCount).toBeGreaterThan(targetUserPreviousDetail.body.data.followersCount)
      expect(toggleUserFollowResponse.statusCode).toBe(200)
    });
  })
})

describe('Unfollow user', () => {
  const path = 'users/unfollow'
  describe('Given an unauthorised user attempts to unfollow', () => {
    it('should respond with 401 status code', async () => {
      const response = await agent.delete(`${BASE_PATH}/${path}`).query({ 'username': user2Credentials.username })
      expect(response.statusCode).toBe(401)
    });
  })
  describe('given user does not exists', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.delete(`${BASE_PATH}/${path}`).query({ 'username': 'non-exising-user' }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given current user attempts to unfollow valid user', () => {
    it('should respond with 200 status code', async () => {
      const currentUserPreviousDetail = await agent.get(`${BASE_PATH}/profile/me`).set('Cookie', await handleTestUserLogin(user1Credentials))
      const targetUserPreviousDetail = await agent.get(`${BASE_PATH}/users/user2`)
      const toggleUserFollowResponse = await agent.delete(`${BASE_PATH}/${path}`).query({ 'username': user2Credentials.username }).set('Cookie', await handleTestUserLogin(user1Credentials))
      const currentUserUpdatedDetail = await agent.get(`${BASE_PATH}/profile/me`).set('Cookie', await handleTestUserLogin(user1Credentials))
      const targetUserUpdatedDetail = await agent.get(`${BASE_PATH}/users/user2`)

      // assert current user followingcount is reduced
      expect(currentUserUpdatedDetail.body.data.followingCount).toBeLessThan(currentUserPreviousDetail.body.data.followingCount)
      // assert target user followers count is reduced
      expect(targetUserUpdatedDetail.body.data.followersCount).toBeLessThan(targetUserPreviousDetail.body.data.followersCount)
      expect(toggleUserFollowResponse.statusCode).toBe(200)
    });
  })
  describe("given current user tries to unfollow user who they aren't previously following", () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.delete(`${BASE_PATH}/${path}`).query({ 'username': user2Credentials.username }).set('Cookie', await handleTestUserLogin(user1Credentials))
      expect(response.statusCode).toBe(404)
    });
  })
})

describe("List user's posts", () => {
  const path = 'users/user2/posts'
  describe('given username that does not exist', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/users/non-existing-user/posts`)
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given valid username', () => {
    it('should respond with 200 status code and return data', async () => {
      const response = await agent.get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data.items')
    });
  })
});

describe("List user's liked posts", () => {
  const path = 'users/user2/liked'
  describe('given username that does not exist', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/users/non-existing-user/liked`)
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given valid username', () => {
    it('should respond with 200 status code and return data', async () => {
      const response = await agent.get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data.items')
    });
  })
});


describe("List user's replies", () => {
  const path = 'users/user2/replies'
  describe('given username that does not exist', () => {
    it('should respond with 404 status code', async () => {
      const response = await agent.get(`${BASE_PATH}/users/non-existing-user/replies`)
      expect(response.statusCode).toBe(404)
    });
  })
  describe('Given valid username', () => {
    it('should respond with 200 status code and return data', async () => {
      const response = await agent.get(`${BASE_PATH}/${path}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data.items')
    });
  })
});