import { createClient } from 'redis'

const redisClient = createClient({
  port: 6379,
  host: 'localhost'
});

redisClient.connect().catch(console.error)

export default redisClient;