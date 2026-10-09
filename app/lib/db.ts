import { neon } from '@neondatabase/serverless';

export class DatabaseConfigError extends Error {
  constructor() {
    super('DATABASE_URL is not configured.');
    this.name = 'DatabaseConfigError';
  }
}

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new DatabaseConfigError();
  }

  return neon(databaseUrl);
}