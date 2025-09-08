import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Only initialize database connection if we have a valid URL
let db: any = null;

if (process.env.POSTGRES_URL && 
    process.env.POSTGRES_URL !== "your-supabase-connection-string-here" &&
    process.env.POSTGRES_URL.startsWith('postgres://')) {
  try {
    const client = postgres(process.env.POSTGRES_URL);
    db = drizzle(client, { schema });
  } catch (error) {
    console.error('Database connection error:', error);
    db = null;
  }
}

export { db };
