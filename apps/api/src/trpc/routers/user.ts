import { z } from 'zod';
import { initTRPC } from '@trpc/server';

// Create tRPC instance
const t = initTRPC.create();

export const userRouter = t.router({
  getUsers: t.procedure.query(async () => {
    return [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];
  }),

  getUserById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return { id: input.id, name: 'John Doe', email: 'john@example.com' };
    }),

  createUser: t.procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      return {
        id: Math.random().toString(),
        name: input.name,
        email: input.email,
      };
    }),

  updateUser: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return {
        id: input.id,
        name: input.name || 'Updated Name',
        email: input.email || 'updated@example.com',
      };
    }),

  deleteUser: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});