import { db } from "../db";
import { users, type User, type NewUser } from "../db/schema";
import { eq } from "drizzle-orm";

export class UserService {
  static async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  static async create(userData: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  static async update(id: string, userData: Partial<NewUser>): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.length > 0;
  }

  static async list(limit: number = 50, offset: number = 0): Promise<User[]> {
    return await db.select().from(users).limit(limit).offset(offset);
  }
}