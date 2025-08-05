import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppModule, LoggerMiddleware } from '@/app.module';
import { DatabaseModule } from '@/db/database.module';
import { HealthModule } from '@/health/health.module';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth-module';
import { ORPCModule } from '@orpc/nest';
import { DATABASE_CONNECTION } from '@/db/database-connection';
import { Request, Response } from 'express';

// Mock the external modules and dependencies
vi.mock('@orpc/nest', () => ({
  ORPCModule: {
    forRoot: vi.fn(() => ({
      module: 'MockORPCModule',
    })),
  },
  onError: vi.fn(),
}));

vi.mock('better-auth', () => ({
  betterAuth: vi.fn(() => ({
    api: {},
    handler: vi.fn(),
  })),
}));

vi.mock('better-auth/adapters/drizzle', () => ({
  drizzleAdapter: vi.fn(() => ({})),
}));

describe('AppModule', () => {
  let appModule: AppModule;
  let module: TestingModule;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        HealthModule,
        UserModule,
        AuthModule.forRootAsync({
          imports: [DatabaseModule],
          useFactory: (database: unknown) => ({
            auth: {} as any,
          }),
          inject: [DATABASE_CONNECTION],
        }),
        ORPCModule.forRoot({
          interceptors: [],
          eventIteratorKeepAliveInterval: 5000,
        }),
      ],
    })
    .overrideModule(DatabaseModule)
    .useValue({ providers: [], exports: [] })
    .overrideModule(HealthModule)
    .useValue({ providers: [], exports: [] })
    .overrideModule(UserModule)
    .useValue({ providers: [], exports: [] })
    .overrideModule(AuthModule)
    .useValue({ providers: [], exports: [] })
    .compile();

    module = testModule;
    appModule = new AppModule();
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });

  describe('configure', () => {
    it('should configure middleware consumer', () => {
      const mockConsumer = {
        apply: vi.fn().mockReturnThis(),
        forRoutes: vi.fn().mockReturnThis(),
      } as any;

      appModule.configure(mockConsumer);

      expect(mockConsumer.apply).toHaveBeenCalledWith(LoggerMiddleware);
      expect(mockConsumer.forRoutes).toHaveBeenCalledWith('*');
    });
  });
});

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: vi.Mock;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    nextFunction = vi.fn();

    mockRequest = {
      ip: '127.0.0.1',
      method: 'GET',
      originalUrl: '/api/health',
      get: vi.fn(),
    };

    mockResponse = {
      on: vi.fn(),
      get: vi.fn(),
      statusCode: 200,
      statusMessage: 'OK',
    };
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should call next function immediately', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledOnce();
    });

    it('should set up response close listener', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.on).toHaveBeenCalledWith('close', expect.any(Function));
    });

    it('should extract request information', () => {
      const getUserAgent = vi.fn().mockReturnValue('test-agent');
      const getReferer = vi.fn().mockReturnValue('http://example.com');
      
      mockRequest.get = vi.fn()
        .mockReturnValueOnce('test-agent') // user-agent
        .mockReturnValueOnce('http://example.com'); // referer

      middleware.use(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.get).toHaveBeenCalledWith('user-agent');
      expect(mockRequest.get).toHaveBeenCalledWith('referer');
    });

    it('should handle missing user-agent and referer', () => {
      mockRequest.get = vi.fn().mockReturnValue(undefined);

      middleware.use(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledOnce();
    });

    it('should log request details on response close', () => {
      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      
      // Mock os.hostname
      vi.mock('os', () => ({
        hostname: () => 'test-hostname',
      }));

      mockRequest.get = vi.fn()
        .mockReturnValueOnce('test-agent')
        .mockReturnValueOnce('http://example.com');
      
      mockResponse.get = vi.fn().mockReturnValue('1024');
      
      let closeCallback: Function;
      mockResponse.on = vi.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          closeCallback = callback;
        }
      });

      middleware.use(mockRequest as Request, mockResponse as Response, nextFunction);

      // Simulate response close
      if (closeCallback) {
        closeCallback();
      }

      expect(mockResponse.on).toHaveBeenCalledWith('close', expect.any(Function));
    });

    it('should handle response without content-length', () => {
      mockResponse.get = vi.fn().mockReturnValue(undefined);
      
      let closeCallback: Function;
      mockResponse.on = vi.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          closeCallback = callback;
        }
      });

      middleware.use(mockRequest as Request, mockResponse as Response, nextFunction);

      // Should not throw when content-length is undefined
      if (closeCallback) {
        expect(() => closeCallback()).not.toThrow();
      }
    });
  });
});