import { initTRPC } from '@trpc/server';

// Create tRPC instance
const t = initTRPC.create();

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;