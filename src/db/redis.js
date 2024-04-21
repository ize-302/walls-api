const { createClient } = require('redis')

const redisClient = createClient({
  port: 6379,
  host: 'localhost'
});

redisClient.connect().catch(console.error)

module.exports = redisClient;