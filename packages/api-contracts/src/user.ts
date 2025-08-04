import { oc } from '@orpc/contract';
import { z } from 'zod';

// Zod schemas for validation
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  status: z.enum(['active', 'inactive', 'pending']),
  createdAt: z.string().datetime(), // Use string for API serialization
  updatedAt: z.string().datetime(), // Use string for API serialization
});

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  image: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const GetUsersQuerySchema = z.object({
  limit: z.number().int().positive().max(100).default(10),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(['name', 'email', 'createdAt', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
});

export const UserIdParamSchema = z.object({
  id: z.string(),
});

export const PaginatedUsersSchema = z.object({
  users: z.array(UserSchema),
  pagination: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean(),
  }),
});

// User Contract Definition
export const userContract = oc
  .tag('User')
  .prefix('/user')
  .router({
    // Get all users with pagination
    list: oc
      .route({
        method: 'GET',
        path: '/',
        summary: 'Get all users',
        description: 'Retrieve a paginated list of users with optional filtering and sorting',
      })
      .input(
        z.object({
          query: GetUsersQuerySchema,
        })
      )
      .output(PaginatedUsersSchema),

    // Get user by ID
    findById: oc
      .route({
        method: 'GET',
        path: '/{id}',
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their ID',
      })
      .input(
        z.object({
          params: UserIdParamSchema,
        })
      )
      .output(UserSchema.nullable()),

    // Create a new user
    create: oc
      .route({
        method: 'POST',
        path: '/',
        summary: 'Create a new user',
        description: 'Create a new user in the system',
      })
      .input(
        z.object({
          json: CreateUserSchema,
        })
      )
      .output(UserSchema),

    // Update existing user
    update: oc
      .route({
        method: 'PUT',
        path: '/{id}',
        summary: 'Update user',
        description: 'Update an existing user by their ID',
      })
      .input(
        z.object({
          params: UserIdParamSchema,
          json: UpdateUserSchema,
        })
      )
      .output(UserSchema.nullable()),

    // Delete user
    delete: oc
      .route({
        method: 'DELETE',
        path: '/{id}',
        summary: 'Delete user',
        description: 'Delete a user by their ID',
      })
      .input(
        z.object({
          params: UserIdParamSchema,
        })
      )
      .output(UserSchema.nullable()),

    // Check if user exists by email
    checkEmail: oc
      .route({
        method: 'POST',
        path: '/check-email',
        summary: 'Check if email exists',
        description: 'Check if a user with the given email already exists',
      })
      .input(
        z.object({
          json: z.object({
            email: z.string().email(),
          }),
        })
      )
      .output(z.object({
        exists: z.boolean(),
      })),

    // Get user count
    count: oc
      .route({
        method: 'GET',
        path: '/count',
        summary: 'Get user count',
        description: 'Get the total number of users in the system',
      })
      .input(z.object({}))
      .output(z.object({
        count: z.number(),
      })),
  });

export type UserContract = typeof userContract;
