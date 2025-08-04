import { oc } from '@orpc/contract';
import { userContract, healthContract } from '@repo/api-contracts';

// Main application contract that combines all module contracts
export const appContract = oc.router({
  user: userContract,
  health: healthContract,
});

export type AppContract = typeof appContract;

// Also export individual contracts for convenience
export { userContract, healthContract } from '@repo/api-contracts';

// Legacy export for compatibility
export const contract = appContract;