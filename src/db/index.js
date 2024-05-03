const { drizzle } = require('drizzle-orm/libsql');
const { createClient } = require('@libsql/client');

const { TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN } = require('../config');

const client = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_DATABASE_AUTH_TOKEN });

const db = drizzle(client);

module.exports = { db }
