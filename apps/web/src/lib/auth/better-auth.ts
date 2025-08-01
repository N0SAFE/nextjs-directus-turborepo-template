import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Database connection for Better Auth
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:copilot-test-password@localhost:5432/nextjs_directus";
const connection = postgres(connectionString);
const db = drizzle(connection);

// Import schema from server package for Better Auth tables
const authSchema = {
  user: {
    id: { type: "text", primaryKey: true },
    name: { type: "text", notNull: true },
    email: { type: "text", notNull: true, unique: true },
    emailVerified: { type: "boolean", notNull: true, default: false },
    image: { type: "text" },
    createdAt: { type: "timestamp", notNull: true, defaultNow: true },
    updatedAt: { type: "timestamp", notNull: true, defaultNow: true },
  },
  session: {
    id: { type: "text", primaryKey: true },
    expiresAt: { type: "timestamp", notNull: true },
    ipAddress: { type: "text" },
    userAgent: { type: "text" },
    userId: { type: "text", notNull: true, references: "user.id" },
    createdAt: { type: "timestamp", notNull: true, defaultNow: true },
    updatedAt: { type: "timestamp", notNull: true, defaultNow: true },
  },
  account: {
    id: { type: "text", primaryKey: true },
    accountId: { type: "text", notNull: true },
    providerId: { type: "text", notNull: true },
    userId: { type: "text", notNull: true, references: "user.id" },
    accessToken: { type: "text" },
    refreshToken: { type: "text" },
    idToken: { type: "text" },
    expiresAt: { type: "timestamp" },
    password: { type: "text" },
    createdAt: { type: "timestamp", notNull: true, defaultNow: true },
    updatedAt: { type: "timestamp", notNull: true, defaultNow: true },
  },
  verification: {
    id: { type: "text", primaryKey: true },
    identifier: { type: "text", notNull: true },
    value: { type: "text", notNull: true },
    expiresAt: { type: "timestamp", notNull: true },
    createdAt: { type: "timestamp", notNull: true, defaultNow: true },
    updatedAt: { type: "timestamp", notNull: true, defaultNow: true },
  },
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "fallback-secret-for-dev",
  
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;