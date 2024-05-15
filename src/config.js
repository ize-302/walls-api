import dotenv from 'dotenv';

let parsed;

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
  const environment = process.env.NODE_ENV;
  const envFile = `.env.${environment}`;
  const result = dotenv.config({ path: envFile });

  console.log(`Running in ${environment} mode`)

  if (result.error) {
    throw result.error;
  }

  parsed = result.parsed;
}

export const { BASE_PATH, PORT, TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN, SESSION_SECRET, NODE_ENV } = process.env || parsed;
