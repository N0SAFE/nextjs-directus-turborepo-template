import { oc } from '@orpc/contract';
import { z } from 'zod';

// Health check response schemas
export const HealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  service: z.string().optional(),
});

export const DatabaseHealthSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  responseTime: z.number().optional(),
  error: z.string().optional(),
});

export const DetailedHealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  service: z.string(),
  uptime: z.number(),
  memory: z.object({
    used: z.number(),
    free: z.number(),
    total: z.number(),
  }),
  database: DatabaseHealthSchema,
});

// Health Contract Definition
export const healthContract = oc
  .tag('Health')
  .prefix('/health')
  .router({
    // Basic health check
    check: oc
      .route({
        method: 'GET',
        path: '/',
        summary: 'Basic health check',
        description: 'Check if the service is running',
      })
      .input(z.object({}))
      .output(HealthResponseSchema),

    // Readiness check
    ready: oc
      .route({
        method: 'GET',
        path: '/ready',
        summary: 'Readiness check',
        description: 'Check if the service is ready to accept requests',
      })
      .input(z.object({}))
      .output(HealthResponseSchema),

    // Liveness check
    live: oc
      .route({
        method: 'GET',
        path: '/live',
        summary: 'Liveness check',
        description: 'Check if the service is alive',
      })
      .input(z.object({}))
      .output(HealthResponseSchema),

    // Detailed health check
    detailed: oc
      .route({
        method: 'GET',
        path: '/detailed',
        summary: 'Detailed health check',
        description: 'Get detailed health information including system metrics',
      })
      .input(z.object({}))
      .output(DetailedHealthResponseSchema),
  });

export type HealthContract = typeof healthContract;
