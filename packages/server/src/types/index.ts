// Simple re-exports for types only - avoid conflicts
export type { 
  User as DatabaseUser, 
  NewUser, 
  Session as DatabaseSession, 
  NewSession,
  Account,
  NewAccount,
  Verification,
  NewVerification 
} from "../db/schema";

export type { 
  Session as AuthSession, 
  User as AuthUser 
} from "../auth";