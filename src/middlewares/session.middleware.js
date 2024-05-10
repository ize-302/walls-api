import expressSession from 'express-session'

import RedisStore from 'connect-redis'
import redisClient from '../db/redis.js';
import { NODE_ENV, SESSION_SECRET } from '../config.js'

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "walls_app:",
})

const sessionMiddleware = expressSession({
  store: redisStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // name: 'sessionId',
  cookie: {
    secure: true, // set to true in prod so it can only transmit over https
    httpOnly: true, // prevents client-side js from reading the cookie
    maxAge: 1000 * 60 * 30, // would expire after 30 minutes. session max age is in milliseconds
    sameSite: 'lax',
  },
});

export default sessionMiddleware