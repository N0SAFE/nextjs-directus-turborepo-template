import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Create PostgreSQL connection
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:password@localhost:5432/mydb";

const pool = new Pool({
  connectionString,
});

// Create Drizzle database instance
export const db = drizzle(pool);

export type Database = typeof db;
