const expressSession = require('express-session')

const RedisStore = require('connect-redis').default
const redisClient = require('../db/redis');
const { SESSION_SECRET } = require('../config')

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "walls_app:",
})

module.exports = expressSession({
  store: redisStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // name: 'sessionId',
  cookie: {
    secure: false, // set to true in prod so it can only transmit over https
    httpOnly: true, // prevents client-side js from reading the cookie
    maxAge: 1000 * 60 * 30, // would expire after 30 minutes. session max age is in milliseconds
    sameSite: 'lax',
  },
});