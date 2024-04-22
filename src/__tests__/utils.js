const request = require('supertest')
const { BASE_PATH } = require('../config')
const app = require('../server');
const { generateUsername } = require("unique-username-generator");

const username = generateUsername("-", 2, 20, 'testuser'); // https://npmjs.com/package/unique-username-generator

const loginCredentials = {
  username: username,
  password: 'password1234'
}

const handleSetCookie = async () => {
  const login_response = await request(app).post(`${BASE_PATH}/login`).send(loginCredentials)
  const cookies = await login_response.headers['set-cookie'];
  console.log(cookies)
  const authCookie = await cookies.find(cookie => cookie.includes('connect.sid'));
  return authCookie
}

module.exports = { handleSetCookie, loginCredentials, username }