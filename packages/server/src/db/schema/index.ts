// Export all schema tables and types
export * from "./auth";

// Re-export for easier imports
export { users, sessions, accounts, verifications } from "./auth";
export type { User, NewUser, Session, NewSession, Account, NewAccount, Verification, NewVerification } from "./auth";