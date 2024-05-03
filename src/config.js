import dotenv from 'dotenv';
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { parsed } = result;

export const { BASE_PATH, PORT, TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN, SESSION_SECRET } = parsed;
