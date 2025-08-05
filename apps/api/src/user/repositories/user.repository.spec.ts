import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserRepository } from '@/user/repositories/user.repository';
import { DatabaseService } from '@/db/services/database.service';

describe('UserRepository', () => {
  let repository: UserRepository;
  let databaseService: DatabaseService;
  let mockDb: any;

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: null,
    status: 'active',
    emailVerified: false,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  const transformedUser = {
    ...mockUser,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    mockDb = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DatabaseService,
          useValue: {
            db: mockDb,
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const input = { name: 'John Doe', email: 'john@example.com' };
      mockDb.returning.mockResolvedValue([mockUser]);

      const result = await repository.create(input);

      expect(result).toEqual(transformedUser);
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith(
        expect.objectContaining({
          name: input.name,
          email: input.email,
          emailVerified: false,
          status: 'active',
        })
      );
      expect(mockDb.returning).toHaveBeenCalled();
    });

    it('should create user with custom status', async () => {
      const input = { name: 'John Doe', email: 'john@example.com', status: 'inactive' };
      mockDb.returning.mockResolvedValue([{ ...mockUser, status: 'inactive' }]);

      const result = await repository.create(input);

      expect(mockDb.values).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'inactive',
        })
      );
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      mockDb.from.mockResolvedValue([mockUser]);

      const result = await repository.findById('1');

      expect(result).toEqual(transformedUser);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.limit).toHaveBeenCalledWith(1);
    });

    it('should return null when user not found', async () => {
      mockDb.from.mockResolvedValue([]);

      const result = await repository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      mockDb.from.mockResolvedValue([mockUser]);

      const result = await repository.findByEmail('john@example.com');

      expect(result).toEqual(transformedUser);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.limit).toHaveBeenCalledWith(1);
    });

    it('should return null when user not found', async () => {
      mockDb.from.mockResolvedValue([]);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find users with pagination', async () => {
      const input = { pagination: { limit: 10, offset: 0 } };
      const users = [mockUser];
      const countResult = [{ count: 1 }];

      // Mock the main query
      mockDb.from.mockResolvedValueOnce(users);
      // Mock the count query
      mockDb.from.mockResolvedValueOnce(countResult);

      const result = await repository.findMany(input);

      expect(result).toEqual({
        users: [transformedUser],
        meta: {
          pagination: {
            total: 1,
            limit: 10,
            offset: 0,
            hasMore: false,
          },
        },
      });
    });

    it('should handle filtering and sorting', async () => {
      const input = {
        pagination: { limit: 10, offset: 0 },
        filter: { name: 'John', email: 'john' },
        sort: { field: 'name', direction: 'asc' },
      };
      const users = [mockUser];
      const countResult = [{ count: 1 }];

      mockDb.from.mockResolvedValueOnce(users);
      mockDb.from.mockResolvedValueOnce(countResult);

      await repository.findMany(input);

      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.orderBy).toHaveBeenCalled();
    });

    it('should handle default sorting when no sort provided', async () => {
      const input = { pagination: { limit: 10, offset: 0 } };
      const users = [mockUser];
      const countResult = [{ count: 1 }];

      mockDb.from.mockResolvedValueOnce(users);
      mockDb.from.mockResolvedValueOnce(countResult);

      await repository.findMany(input);

      expect(mockDb.orderBy).toHaveBeenCalled();
    });

    it('should throw error for unsupported sort field', async () => {
      const input = {
        pagination: { limit: 10, offset: 0 },
        sort: { field: 'unsupported', direction: 'asc' },
      };

      await expect(repository.findMany(input)).rejects.toThrow(
        'Unsupported sort field: unsupported'
      );
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const input = { name: 'Jane Doe' };
      const updatedUser = { ...mockUser, name: 'Jane Doe' };
      mockDb.returning.mockResolvedValue([updatedUser]);

      const result = await repository.update('1', input);

      expect(result).toEqual({ ...transformedUser, name: 'Jane Doe' });
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({
          ...input,
          updatedAt: expect.any(Date),
        })
      );
      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.returning).toHaveBeenCalled();
    });

    it('should return null when update fails', async () => {
      mockDb.returning.mockResolvedValue([]);

      const result = await repository.update('nonexistent', { name: 'Jane' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      mockDb.returning.mockResolvedValue([mockUser]);

      const result = await repository.delete('1');

      expect(result).toEqual(transformedUser);
      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.returning).toHaveBeenCalled();
    });

    it('should return null when delete fails', async () => {
      mockDb.returning.mockResolvedValue([]);

      const result = await repository.delete('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('existsByEmail', () => {
    it('should return true when user exists', async () => {
      mockDb.from.mockResolvedValue([{ id: '1' }]);

      const result = await repository.existsByEmail('john@example.com');

      expect(result).toBe(true);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.limit).toHaveBeenCalledWith(1);
    });

    it('should return false when user does not exist', async () => {
      mockDb.from.mockResolvedValue([]);

      const result = await repository.existsByEmail('nonexistent@example.com');

      expect(result).toBe(false);
    });
  });

  describe('getCount', () => {
    it('should return user count', async () => {
      mockDb.from.mockResolvedValue([{ count: 42 }]);

      const result = await repository.getCount();

      expect(result).toBe(42);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
    });

    it('should return 0 when no count result', async () => {
      mockDb.from.mockResolvedValue([]);

      const result = await repository.getCount();

      expect(result).toBe(0);
    });
  });

  describe('transformUser', () => {
    it('should transform user dates to ISO strings', () => {
      // Access the private method through casting
      const result = (repository as any).transformUser(mockUser);

      expect(result).toEqual(transformedUser);
    });

    it('should return null for null input', () => {
      const result = (repository as any).transformUser(null);

      expect(result).toBeNull();
    });
  });

  describe('transformUsers', () => {
    it('should transform array of users', () => {
      const users = [mockUser, { ...mockUser, id: '2' }];
      const result = (repository as any).transformUsers(users);

      expect(result).toEqual([
        transformedUser,
        { ...transformedUser, id: '2' },
      ]);
    });

    it('should handle empty array', () => {
      const result = (repository as any).transformUsers([]);

      expect(result).toEqual([]);
    });
  });
});