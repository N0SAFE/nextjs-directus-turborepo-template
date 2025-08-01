import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/nextjs_directus";

async function main() {
  const connection = postgres(connectionString, { max: 1 });
  const db = drizzle(connection);

  console.log("🚀 Running migrations...");
  
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });

  console.log("✅ Migrations completed successfully!");
  await connection.end();
}

main().catch((error) => {
  console.error("❌ Migration failed:", error);
  process.exit(1);
});