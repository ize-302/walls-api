import supertest from 'supertest'
import { BASE_PATH } from '../src/config.js'
import app from '../src/server.js';
import { comments, follows, likes, posts, profiles, users } from '../src/db/schema.js';
import { db } from '../src/db/index.js';

const agent = supertest.agent(app);

export const user1Credentials = {
  username: 'user1',
  password: 'password1234'
}

export const user2Credentials = {
  username: 'user2',
  password: 'password1234'
}

export const handleTestUserLogin = async (credentials) => {
  const login_response = await agent.post(`${BASE_PATH}/login`).send(credentials)
  const cookies = await login_response.headers['set-cookie'];
  // console.log('cookies', cookies)
  const authCookie = await cookies.find(cookie => cookie.includes('connect.sid'));
  // console.log('autcookie', authCookie)
  return authCookie
}

export const initialSetup = async () => {
  // create account for user2 to test against
  const response = await agent.post(`${BASE_PATH}/register`).send(user2Credentials)
  return response
}

export const clearOutTestData = async () => {
  await db.delete(users)
  await db.delete(posts)
  await db.delete(comments)
  await db.delete(follows)
  await db.delete(likes)
  await db.delete(profiles)
}