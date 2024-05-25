import { TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN } from './src/config.js';

module.exports = {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "sqlite",
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