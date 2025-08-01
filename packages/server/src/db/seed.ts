import { db } from "./index";
import { users, accounts } from "./schema";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create a default admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const [adminUser] = await db.insert(users).values({
      id: nanoid(),
      name: "Admin User",
      email: "admin@example.com",
      emailVerified: true,
    }).returning();

    // Create a password account for the admin user
    await db.insert(accounts).values({
      id: nanoid(),
      accountId: adminUser.id,
      providerId: "credential",
      userId: adminUser.id,
      password: hashedPassword,
    });

    console.log("✅ Database seeded successfully!");
    console.log("📧 Admin user created:");
    console.log("   Email: admin@example.com");
    console.log("   Password: admin123");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed().catch((error) => {
  console.error("❌ Seed process failed:", error);
  process.exit(1);
});