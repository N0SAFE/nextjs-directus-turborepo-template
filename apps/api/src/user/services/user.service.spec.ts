import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from '@/user/services/user.service';
import { UserRepository } from '@/user/repositories/user.repository';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: null,
    status: 'active',
    emailVerified: false,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: vi.fn(),
            findById: vi.fn(),
            findByEmail: vi.fn(),
            findMany: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            existsByEmail: vi.fn(),
            getCount: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user when email does not exist', async () => {
      const input = { name: 'John Doe', email: 'john@example.com' };
      vi.mocked(repository.findByEmail).mockResolvedValue(null);
      vi.mocked(repository.create).mockResolvedValue(mockUser);

      const result = await service.createUser(input);

      expect(result).toEqual(mockUser);
      expect(repository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(repository.create).toHaveBeenCalledWith(input);
    });

    it('should throw ConflictException when user with email already exists', async () => {
      const input = { name: 'John Doe', email: 'john@example.com' };
      vi.mocked(repository.findByEmail).mockResolvedValue(mockUser);

      await expect(service.createUser(input)).rejects.toThrow(ConflictException);
      expect(repository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      vi.mocked(repository.findById).mockResolvedValue(mockUser);

      const result = await service.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(repository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user not found', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(service.getUserById('1')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('findUserById', () => {
    it('should return user when found', async () => {
      vi.mocked(repository.findById).mockResolvedValue(mockUser);

      const result = await service.findUserById('1');

      expect(result).toEqual(mockUser);
      expect(repository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null when user not found', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      const result = await service.findUserById('1');

      expect(result).toBeNull();
      expect(repository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('john@example.com');

      expect(result).toEqual(mockUser);
      expect(repository.findByEmail).toHaveBeenCalledWith('john@example.com');
    });
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const input = { pagination: { limit: 10, offset: 0 } };
      const mockResponse = {
        users: [mockUser],
        meta: { pagination: { total: 1, limit: 10, offset: 0, hasMore: false } },
      };
      vi.mocked(repository.findMany).mockResolvedValue(mockResponse);

      const result = await service.getUsers(input);

      expect(result).toEqual(mockResponse);
      expect(repository.findMany).toHaveBeenCalledWith(input);
    });
  });

  describe('updateUser', () => {
    it('should update user when user exists and no email conflict', async () => {
      const input = { name: 'Jane Doe' };
      const updatedUser = { ...mockUser, name: 'Jane Doe' };
      
      vi.mocked(repository.findById).mockResolvedValue(mockUser);
      vi.mocked(repository.update).mockResolvedValue(updatedUser);

      const result = await service.updateUser('1', input);

      expect(result).toEqual(updatedUser);
      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(repository.update).toHaveBeenCalledWith('1', input);
    });

    it('should return null when user does not exist', async () => {
      const input = { name: 'Jane Doe' };
      vi.mocked(repository.findById).mockResolvedValue(null);

      const result = await service.updateUser('1', input);

      expect(result).toBeNull();
      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should update user with new email when no conflict', async () => {
      const input = { email: 'jane@example.com' };
      const updatedUser = { ...mockUser, email: 'jane@example.com' };
      
      vi.mocked(repository.findById).mockResolvedValue(mockUser);
      vi.mocked(repository.existsByEmail).mockResolvedValue(false);
      vi.mocked(repository.update).mockResolvedValue(updatedUser);

      const result = await service.updateUser('1', input);

      expect(result).toEqual(updatedUser);
      expect(repository.existsByEmail).toHaveBeenCalledWith('jane@example.com');
      expect(repository.update).toHaveBeenCalledWith('1', input);
    });

    it('should throw ConflictException when updating to existing email', async () => {
      const input = { email: 'existing@example.com' };
      
      vi.mocked(repository.findById).mockResolvedValue(mockUser);
      vi.mocked(repository.existsByEmail).mockResolvedValue(true);

      await expect(service.updateUser('1', input)).rejects.toThrow(ConflictException);
      expect(repository.existsByEmail).toHaveBeenCalledWith('existing@example.com');
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should not check email conflict when email is same as current', async () => {
      const input = { email: 'john@example.com', name: 'John Updated' };
      const updatedUser = { ...mockUser, name: 'John Updated' };
      
      vi.mocked(repository.findById).mockResolvedValue(mockUser);
      vi.mocked(repository.update).mockResolvedValue(updatedUser);

      const result = await service.updateUser('1', input);

      expect(result).toEqual(updatedUser);
      expect(repository.existsByEmail).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith('1', input);
    });
  });

  describe('deleteUser', () => {
    it('should delete user when user exists', async () => {
      vi.mocked(repository.findById).mockResolvedValue(mockUser);
      vi.mocked(repository.delete).mockResolvedValue(mockUser);

      const result = await service.deleteUser('1');

      expect(result).toEqual(mockUser);
      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should return null when user does not exist', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      const result = await service.deleteUser('1');

      expect(result).toBeNull();
      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('checkUserExistsByEmail', () => {
    it('should return exists true when user exists', async () => {
      vi.mocked(repository.existsByEmail).mockResolvedValue(true);

      const result = await service.checkUserExistsByEmail('john@example.com');

      expect(result).toEqual({ exists: true });
      expect(repository.existsByEmail).toHaveBeenCalledWith('john@example.com');
    });

    it('should return exists false when user does not exist', async () => {
      vi.mocked(repository.existsByEmail).mockResolvedValue(false);

      const result = await service.checkUserExistsByEmail('nonexistent@example.com');

      expect(result).toEqual({ exists: false });
      expect(repository.existsByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });
  });

  describe('getUserCount', () => {
    it('should return user count', async () => {
      vi.mocked(repository.getCount).mockResolvedValue(42);

      const result = await service.getUserCount();

      expect(result).toEqual({ count: 42 });
      expect(repository.getCount).toHaveBeenCalledOnce();
    });
  });
});