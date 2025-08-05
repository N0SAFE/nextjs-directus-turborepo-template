import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HealthController } from './health.controller';
import { HealthService } from '../services/health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const mockHealthService = {
      getHealth: vi.fn(),
      getDetailedHealth: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useFactory: () => mockHealthService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return handler function', () => {
      const mockHealth = { status: 'ok', timestamp: new Date().toISOString() };
      vi.mocked(service.getHealth).mockResolvedValue(mockHealth);

      const implementation = controller.check();
      
      expect(implementation).toBeDefined();
      expect(typeof implementation.handler).toBe('function');
    });

    it('should call health service when handler is executed', async () => {
      const mockHealth = { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'nestjs-api'
      };
      vi.mocked(service.getHealth).mockResolvedValue(mockHealth);

      const implementation = controller.check();
      const result = await implementation.handler({});

      expect(result).toEqual(mockHealth);
      expect(service.getHealth).toHaveBeenCalledOnce();
    });
  });

  describe('detailed', () => {
    it('should return handler function', () => {
      const mockDetailedHealth = { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'nestjs-api',
        uptime: 123,
        memory: { used: 1000, free: 2000, total: 3000 },
        database: { status: 'ok' }
      };
      vi.mocked(service.getDetailedHealth).mockResolvedValue(mockDetailedHealth);

      const implementation = controller.detailed();
      
      expect(implementation).toBeDefined();
      expect(typeof implementation.handler).toBe('function');
    });

    it('should call detailed health service when handler is executed', async () => {
      const mockDetailedHealth = { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'nestjs-api',
        uptime: 123,
        memory: { used: 1000, free: 2000, total: 3000 },
        database: { status: 'ok' }
      };
      vi.mocked(service.getDetailedHealth).mockResolvedValue(mockDetailedHealth);

      const implementation = controller.detailed();
      const result = await implementation.handler({});

      expect(result).toEqual(mockDetailedHealth);
      expect(service.getDetailedHealth).toHaveBeenCalledOnce();
    });
  });
});