const { TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN } = require('./src/config');

module.exports = {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_DATABASE_AUTH_TOKEN
  },
  // Print all statements
  verbose: true,
  // Always ask for my confirmation
  strict: true,
};