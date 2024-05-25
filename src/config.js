import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';

dotenv.config({ path: `.env.${env}` });


export const { BASE_PATH, PORT, TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN, SESSION_SECRET, NODE_ENV } = process.env;