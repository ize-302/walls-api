import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import { TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN } from '../config.js';

const client = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_DATABASE_AUTH_TOKEN });

export const db = drizzle(client);
