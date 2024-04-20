const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool, Client } = require("pg");
const schema = require("./schema");

const { DATABASE_URL } = require('../config');

if (!DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_URL");
}

const client = new Client({ connectionString: DATABASE_URL });

client.connect();
module.exports = drizzle(client, { schema: schema });
