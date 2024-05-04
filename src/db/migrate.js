import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator'

import { TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN } from '../config';

const client = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_DATABASE_AUTH_TOKEN });

const db = drizzle(client);

async function main() {
  console.log("migration started...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("migration ended...");
  process.exit(0);
}

main().catch((err) => {
  console.log(err);
  process.exit(0);
});
