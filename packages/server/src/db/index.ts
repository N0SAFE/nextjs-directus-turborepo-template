import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

export let db: PostgresJsDatabase<typeof schema>;

const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/nextjs_directus";

if (process.env.NODE_ENV === "production") {
  db = drizzle(postgres(connectionString), {
    schema,
  });
} else {
  if (!global.db) {
    global.db = drizzle(postgres(connectionString), {
      schema,
    });
  }
  db = global.db;
}

export * from "./schema";
export { postgres };