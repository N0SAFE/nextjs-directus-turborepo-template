import { oc } from '@orpc/contract'
import z from 'zod/v4'

// Static core plugin contracts to avoid circular dependencies
// Each contract matches the plugins defined in core/plugins

// CLI Plugin Contract
const cliContract = oc.router({
  execute: oc
    .input(z.object({ command: z.string(), args: z.array(z.string()).optional() }))
    .output(z.object({ 
      success: z.boolean(), 
      output: z.string(), 
      error: z.string().optional(),
      exitCode: z.number().optional()
    })),
  
  getEnvironment: oc
    .output(z.object({
      nodeVersion: z.string(),
      platform: z.string(),
      arch: z.string(),
      cwd: z.string(),
      env: z.record(z.string(), z.string()),
      memory: z.object({
        used: z.number(),
        total: z.number(),
        percentage: z.number()
      })
    })),
  
  getSystemInfo: oc
    .output(z.object({
      uptime: z.number(),
      loadAverage: z.array(z.number()),
      cpus: z.number(),
      totalMemory: z.number(),
      freeMemory: z.number()
    })),
})

// Routes Plugin Contract
const routesContract = oc.router({
  getRoutes: oc
    .output(z.array(z.object({
      path: z.string(),
      type: z.enum(['page', 'layout', 'api']),
      file: z.string(),
      dynamic: z.boolean(),
      methods: z.array(z.string()).optional(),
    }))),

  getCurrentRoute: oc
    .output(z.object({
      pathname: z.string(),
      routeName: z.string(),
      params: z.record(z.string(), z.any()).optional(),
      query: z.record(z.string(), z.any()).optional(),
    })),

  analyzeRoute: oc
    .input(z.object({ path: z.string() }))
    .output(z.object({
      path: z.string(),
      exists: z.boolean(),
      type: z.string(),
      file: z.string().optional(),
      methods: z.array(z.string()).optional(),
      dynamic: z.boolean(),
      segments: z.array(z.object({
        name: z.string(),
        dynamic: z.boolean(),
        optional: z.boolean(),
      })),
    })),

  getRouteStats: oc
    .output(z.object({
      totalRoutes: z.number(),
      pageRoutes: z.number(),
      apiRoutes: z.number(),
      layoutRoutes: z.number(),
      dynamicRoutes: z.number(),
      staticRoutes: z.number(),
    })),

  testApiEndpoints: oc
    .output(z.array(z.object({
      path: z.string(),
      method: z.string(),
      status: z.number(),
      responseTime: z.number(),
      success: z.boolean(),
      error: z.string().optional(),
    }))),
})

// Bundles Plugin Contract
const bundlesContract = oc.router({
  getBundleStats: oc
    .output(z.object({
      totalSize: z.number(),
      gzippedSize: z.number(),
      chunks: z.array(z.object({
        name: z.string(),
        size: z.number(),
        type: z.string()
      })),
      assets: z.array(z.object({
        name: z.string(),
        size: z.number(),
        type: z.string()
      }))
    })),
  
  getDependencies: oc
    .output(z.object({
      production: z.record(z.string(), z.string()),
      development: z.record(z.string(), z.string()),
      outdated: z.array(z.object({
        name: z.string(),
        current: z.string(),
        wanted: z.string(),
        latest: z.string()
      }))
    })),
  
  analyzeDependencies: oc
    .output(z.object({
      totalDependencies: z.number(),
      productionDependencies: z.number(),
      developmentDependencies: z.number(),
      outdatedDependencies: z.number(),
      vulnerabilities: z.number(),
      bundleSize: z.object({
        raw: z.number(),
        gzipped: z.number(),
        optimizationScore: z.number()
      })
    }))
})

// Logs Plugin Contract
const logsContract = oc.router({
  getLogs: oc
    .input(z.object({ 
      level: z.enum(['error', 'warn', 'info', 'debug']).optional(),
      limit: z.number().optional() 
    }).optional())
    .output(z.array(z.object({
      timestamp: z.string(),
      level: z.string(),
      message: z.string(),
      source: z.string().optional(),
      stack: z.string().optional()
    }))),
  
  getProcessInfo: oc
    .output(z.object({
      pid: z.number(),
      uptime: z.number(),
      memory: z.object({
        rss: z.number(),
        heapTotal: z.number(),
        heapUsed: z.number(),
        external: z.number()
      }),
      cpu: z.object({
        user: z.number(),
        system: z.number()
      })
    })),
  
  clearLogs: oc
    .output(z.object({ success: z.boolean() }))
})

// Auth Plugin Contract
const authContract = oc.router({
  getAuthConfig: oc
    .output(z.object({
      providers: z.array(z.string()),
      session: z.object({
        strategy: z.string(),
        maxAge: z.number()
      }),
      features: z.object({
        passkeys: z.boolean(),
        twoFactor: z.boolean(),
        emailVerification: z.boolean()
      })
    })),
  
  getCurrentSession: oc
    .output(z.object({
      user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string().optional(),
        image: z.string().optional()
      }).optional(),
      expires: z.string().optional(),
      authenticated: z.boolean()
    })),
  
  getSecurityEvents: oc
    .output(z.array(z.object({
      id: z.string(),
      type: z.string(),
      timestamp: z.string(),
      userAgent: z.string().optional(),
      ip: z.string().optional(),
      details: z.record(z.string(), z.any()).optional()
    }))),
  
  getPasskeys: oc
    .output(z.array(z.object({
      id: z.string(),
      name: z.string(),
      createdAt: z.string(),
      lastUsed: z.string().optional()
    })))
})

/**
 * Static DevTools contract for type-safe server communication
 * This avoids circular dependencies by defining contracts directly
 */
export const devtoolsContract = oc.router({
  'core-cli': cliContract,
  'core-routes': routesContract,
  'core-bundles': bundlesContract,
  'core-logs': logsContract,
  'core-auth': authContract,
})

export type DevtoolsContract = typeof devtoolsContract