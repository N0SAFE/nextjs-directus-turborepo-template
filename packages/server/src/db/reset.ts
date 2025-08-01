import { db } from "./index";
import { users, sessions, accounts, verifications } from "./schema";

async function reset() {
  console.log("🗑️  Resetting database...");

  try {
    // Delete all data in reverse order of dependencies
    await db.delete(verifications);
    await db.delete(sessions);
    await db.delete(accounts);
    await db.delete(users);

    console.log("✅ Database reset successfully!");
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    throw error;
  }
}

reset().catch((error) => {
  console.error("❌ Reset process failed:", error);
  process.exit(1);
});