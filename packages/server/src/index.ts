// Main server package exports - explicit exports to avoid conflicts
export { db } from "./db";
export { auth } from "./auth";
export * from "./services";

// Re-export specific types to avoid conflicts
export type { 
  User as DatabaseUser, 
  NewUser, 
  Session as DatabaseSession, 
  NewSession,
  Account,
  NewAccount,
  Verification,
  NewVerification 
} from "./db/schema";

export type { 
  Session as AuthSession, 
  User as AuthUser 
} from "./auth";