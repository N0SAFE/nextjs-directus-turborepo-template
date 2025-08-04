import { oc } from '@orpc/contract';
import { userContract } from './user';
import { healthContract } from './health';

// Main app contract that combines all feature contracts
export const appContract = oc.router({
  user: userContract,
  health: healthContract,
});

export type AppContract = typeof appContract;

// Re-export individual contracts and schemas
export * from './user';
export * from './health';
