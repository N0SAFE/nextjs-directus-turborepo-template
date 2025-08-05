import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserController } from '@/user/controllers/user.controller';
import { UserService } from '@/user/services/user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

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
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUsers: vi.fn(),
            findUserById: vi.fn(),
            createUser: vi.fn(),
            updateUser: vi.fn(),
            deleteUser: vi.fn(),
            checkUserExistsByEmail: vi.fn(),
            getUserCount: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should return list implementation handler', () => {
      const input = { pagination: { limit: 10, offset: 0 } };
      const mockResponse = {
        users: [mockUser],
        meta: { pagination: { total: 1, limit: 10, offset: 0, hasMore: false } },
      };
      vi.mocked(service.getUsers).mockResolvedValue(mockResponse);

      const implementation = controller.list();
      
      expect(implementation).toBeDefined();
      expect(typeof implementation.handler).toBe('function');
    });

    it('should call getUsers service when handler is executed', async () => {
      const input = { pagination: { limit: 10, offset: 0 } };
      const mockResponse = {
        users: [mockUser],
        meta: { pagination: { total: 1, limit: 10, offset: 0, hasMore: false } },
      };
      vi.mocked(service.getUsers).mockResolvedValue(mockResponse);

      const implementation = controller.list();
      const result = await implementation.handler({ input });

      expect(result).toEqual(mockResponse);
      expect(service.getUsers).toHaveBeenCalledWith(input);
    });
  });

  describe('findById', () => {
    it('should return findById implementation handler', () => {
      const input = { id: '1' };
      vi.mocked(service.findUserById).mockResolvedValue(mockUser);

      const implementation = controller.findById();
      
      expect(implementation).toBeDefined();
      expect(typeof implementation.handler).toBe('function');
    });

    it('should call findUserById service when handler is executed', async () => {
      const input = { id: '1' };
      vi.mocked(service.findUserById).mockResolvedValue(mockUser);

      const implementation = controller.findById();
      const result = await implementation.handler({ input });

      expect(result).toEqual(mockUser);
      expect(service.findUserById).toHaveBeenCalledWith(input.id);
    });
  });

  describe('create', () => {
    it('should call createUser service when handler is executed', async () => {
      const input = { name: 'John Doe', email: 'john@example.com' };
      vi.mocked(service.createUser).mockResolvedValue(mockUser);

      const implementation = controller.create();
      const result = await implementation.handler({ input });

      expect(result).toEqual(mockUser);
      expect(service.createUser).toHaveBeenCalledWith(input);
    });
  });

  describe('update', () => {
    it('should call updateUser service when handler is executed', async () => {
      const input = { id: '1', name: 'Jane Doe' };
      const updatedUser = { ...mockUser, name: 'Jane Doe' };
      vi.mocked(service.updateUser).mockResolvedValue(updatedUser);

      const implementation = controller.update();
      const result = await implementation.handler({ input });

      expect(result).toEqual(updatedUser);
      expect(service.updateUser).toHaveBeenCalledWith(input.id, input);
    });
  });

  describe('delete', () => {
    it('should call deleteUser service when handler is executed', async () => {
      const input = { id: '1' };
      vi.mocked(service.deleteUser).mockResolvedValue(mockUser);

      const implementation = controller.delete();
      const result = await implementation.handler({ input });

      expect(result).toEqual(mockUser);
      expect(service.deleteUser).toHaveBeenCalledWith(input.id);
    });
  });

  describe('checkEmail', () => {
    it('should call checkUserExistsByEmail service when handler is executed', async () => {
      const input = { email: 'john@example.com' };
      const mockResponse = { exists: true };
      vi.mocked(service.checkUserExistsByEmail).mockResolvedValue(mockResponse);

      const implementation = controller.checkEmail();
      const result = await implementation.handler({ input });

      expect(result).toEqual(mockResponse);
      expect(service.checkUserExistsByEmail).toHaveBeenCalledWith(input.email);
    });
  });

  describe('count', () => {
    it('should call getUserCount service when handler is executed', async () => {
      const mockResponse = { count: 5 };
      vi.mocked(service.getUserCount).mockResolvedValue(mockResponse);

      const implementation = controller.count();
      const result = await implementation.handler({});

      expect(result).toEqual(mockResponse);
      expect(service.getUserCount).toHaveBeenCalledOnce();
    });
  });
});