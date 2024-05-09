import request from 'supertest'
import { BASE_PATH } from '../config.js'
import app from '../server.js';
import { comments, follows, likes, posts, profiles, users } from '../db/schema.js';
import { db } from '../db/index.js';


export const user1Credentials = {
  username: 'user1',
  password: 'password1234'
}

export const user2Credentials = {
  username: 'user2',
  password: 'password1234'
}

export const handleTestUserLogin = async (credentials) => {
  const login_response = await request(app).post(`${BASE_PATH}/login`).send(credentials)
  const cookies = await login_response.headers['set-cookie'];
  const authCookie = await cookies.find(cookie => cookie.includes('connect.sid'));
  return authCookie
}

export const initialSetup = async () => {
  // create user2
  await request(app).post(`${BASE_PATH}/register`).send(user2Credentials)
}

export const clearOutTestData = async () => {
  await db.delete(users)
  await db.delete(posts)
  await db.delete(comments)
  await db.delete(follows)
  await db.delete(likes)
  await db.delete(profiles)
}