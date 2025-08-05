import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HealthRepository } from '@/health/repositories/health.repository';
import { DatabaseService } from '@/db/services/database.service';

describe('HealthRepository', () => {
  let repository: HealthRepository;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthRepository,
        {
          provide: DatabaseService,
          useValue: {
            db: {
              execute: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<HealthRepository>(HealthRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('checkDatabaseHealth', () => {
    it('should return ok status when database query succeeds', async () => {
      const startTime = Date.now();
      vi.mocked(databaseService.db.execute).mockResolvedValue(undefined);

      const result = await repository.checkDatabaseHealth();

      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(typeof result.responseTime).toBe('number');
      expect(result.responseTime).toBeGreaterThanOrEqual(0);
      expect(databaseService.db.execute).toHaveBeenCalledWith('SELECT 1');
    });

    it('should return error status when database query fails', async () => {
      const errorMessage = 'Connection timeout';
      vi.mocked(databaseService.db.execute).mockRejectedValue(new Error(errorMessage));

      const result = await repository.checkDatabaseHealth();

      expect(result.status).toBe('error');
      expect(result.timestamp).toBeDefined();
      expect(typeof result.responseTime).toBe('number');
      expect(result.responseTime).toBeGreaterThanOrEqual(0);
      expect(result.error).toBe(errorMessage);
      expect(databaseService.db.execute).toHaveBeenCalledWith('SELECT 1');
    });

    it('should handle unknown errors', async () => {
      vi.mocked(databaseService.db.execute).mockRejectedValue('Unknown error');

      const result = await repository.checkDatabaseHealth();

      expect(result.status).toBe('error');
      expect(result.error).toBe('Unknown database error');
    });
  });

  describe('getMemoryInfo', () => {
    it('should return memory usage information', () => {
      // Mock process.memoryUsage()
      const mockMemUsage = {
        rss: 50000000,
        heapTotal: 30000000,
        heapUsed: 20000000,
        external: 1000000,
        arrayBuffers: 500000,
      };
      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemUsage);

      const result = repository.getMemoryInfo();

      expect(result).toEqual({
        used: mockMemUsage.heapUsed,
        free: mockMemUsage.heapTotal - mockMemUsage.heapUsed,
        total: mockMemUsage.heapTotal,
      });
      expect(result.used).toBe(20000000);
      expect(result.free).toBe(10000000);
      expect(result.total).toBe(30000000);
    });
  });

  describe('getUptime', () => {
    it('should return process uptime', () => {
      const mockUptime = 123.456;
      vi.spyOn(process, 'uptime').mockReturnValue(mockUptime);

      const result = repository.getUptime();

      expect(result).toBe(mockUptime);
      expect(process.uptime).toHaveBeenCalledOnce();
    });
  });
});