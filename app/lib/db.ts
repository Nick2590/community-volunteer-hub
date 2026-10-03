import { neon } from '@neondatabase/serverless';

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not configured. A shared PostgreSQL database connection is required.',
    );
  }

  return neon(databaseUrl);
}