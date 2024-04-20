const { defineConfig } = require('drizzle-kit')

const { DATABASE_URL } = require('./src/config');

module.exports = defineConfig({
  schema: "./src/db/schema.js",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: DATABASE_URL
  },
  verbose: true,
  strict: true,
})
