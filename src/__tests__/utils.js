import request from 'supertest'
import { BASE_PATH } from '../config.js'
import app from '../server.js';
import { generateUsername } from "unique-username-generator";

export const username = generateUsername("-", 2, 20, 'testuser'); // https://npmjs.com/package/unique-username-generator
export const existing_username = 'testuser-humanist18'

export const loginCredentials = {
  username: username,
  password: 'password1234'
}

export const handleSetCookie = async () => {
  const login_response = await request(app).post(`${BASE_PATH}/login`).send(loginCredentials)
  const cookies = await login_response.headers['set-cookie'];
  const authCookie = await cookies.find(cookie => cookie.includes('connect.sid'));
  return authCookie
}
