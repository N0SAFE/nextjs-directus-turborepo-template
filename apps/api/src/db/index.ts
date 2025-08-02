import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mydb';

// Create PostgreSQL client
const client = postgres(connectionString);

// Create Drizzle database instance
export const db = drizzle(client);

export type Database = typeof db;