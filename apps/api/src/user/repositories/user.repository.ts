import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../db/services/database.service';
import { user } from '../../db/drizzle/schema/auth';
import { eq, desc, asc, or, like, count, and, SQL } from 'drizzle-orm';
import { CreateUserSchema, UpdateUserSchema, GetUsersQuerySchema } from '../contracts/user.contract';
import { z } from 'zod';

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type GetUsersInput = z.infer<typeof GetUsersQuerySchema>;

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Transform user object for API response (serialize dates)
   */
  private transformUser(user: any) {
    if (!user) {
      return null;
    }
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Transform multiple users for API response
   */
  private transformUsers(users: any[]) {
    return users.map(user => this.transformUser(user));
  }

  /**
   * Create a new user
   */
  async create(input: CreateUserInput) {
    const newUser = await this.databaseService.db.insert(user).values({
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      image: input.image || null,
      status: input.status || 'active',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return this.transformUser(newUser[0]);
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    const foundUser = await this.databaseService.db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    return this.transformUser(foundUser[0] || null);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    const foundUser = await this.databaseService.db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    return this.transformUser(foundUser[0] || null);
  }

  /**
   * Find all users with pagination and filtering
   */
  async findMany(input: GetUsersInput) {
    // Build the where conditions
    const conditions: SQL<unknown>[] = [];
    
    if (input.search) {
      conditions.push(
        or(
          like(user.name, `%${input.search}%`),
          like(user.email, `%${input.search}%`)
        )!
      );
    }
    
    if (input.status) {
      conditions.push(eq(user.status, input.status));
    }
    
    const whereCondition = conditions.length > 0 
      ? conditions.length === 1 
        ? conditions[0] 
        : and(...conditions)
      : undefined;

    // Build the order by condition
    let orderByCondition;
    if (input.sortBy === 'name') {
      orderByCondition = input.sortOrder === 'asc' ? asc(user.name) : desc(user.name);
    } else if (input.sortBy === 'email') {
      orderByCondition = input.sortOrder === 'asc' ? asc(user.email) : desc(user.email);
    } else if (input.sortBy === 'status') {
      orderByCondition = input.sortOrder === 'asc' ? asc(user.status) : desc(user.status);
    } else {
      orderByCondition = input.sortOrder === 'asc' ? asc(user.createdAt) : desc(user.createdAt);
    }

    // Execute the main query with all conditions
    const users = whereCondition 
      ? await this.databaseService.db
          .select()
          .from(user)
          .where(whereCondition)
          .orderBy(orderByCondition)
          .limit(input.limit)
          .offset(input.offset)
      : await this.databaseService.db
          .select()
          .from(user)
          .orderBy(orderByCondition)
          .limit(input.limit)
          .offset(input.offset);
    
    // Get total count for pagination info
    const totalResult = whereCondition
      ? await this.databaseService.db
          .select({ count: count() })
          .from(user)
          .where(whereCondition)
      : await this.databaseService.db
          .select({ count: count() })
          .from(user);

    const total = totalResult[0]?.count || 0;

    return {
      users: this.transformUsers(users),
      pagination: {
        total,
        limit: input.limit,
        offset: input.offset,
        hasMore: input.offset + input.limit < total,
      },
    };
  }

  /**
   * Update user by ID
   */
  async update(id: string, input: UpdateUserInput) {
    const updatedUser = await this.databaseService.db
      .update(user)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))
      .returning();

    return this.transformUser(updatedUser[0] || null);
  }

  /**
   * Delete user by ID
   */
  async delete(id: string) {
    const deletedUser = await this.databaseService.db
      .delete(user)
      .where(eq(user.id, id))
      .returning();

    return this.transformUser(deletedUser[0] || null);
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const existingUser = await this.databaseService.db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    return existingUser.length > 0;
  }

  /**
   * Get user count
   */
  async getCount(): Promise<number> {
    const result = await this.databaseService.db
      .select({ count: count() })
      .from(user);

    return result[0]?.count || 0;
  }
}