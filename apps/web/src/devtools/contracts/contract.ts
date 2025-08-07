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
  
  executeStream: oc
    .input(z.object({ command: z.string(), args: z.array(z.string()).optional() }))
    .output(z.object({ 
      success: z.boolean(), 
      output: z.string(), 
      error: z.string().optional(),
      exitCode: z.number().optional()
    })),
  
  getScripts: oc
    .output(z.record(z.string(), z.any())),
  
  runScript: oc
    .input(z.object({ script: z.string(), args: z.array(z.string()).optional() }))
    .output(z.object({ 
      success: z.boolean(), 
      output: z.string(), 
      error: z.string().optional(),
      exitCode: z.number().optional()
    })),
  
  getAvailableCommands: oc
    .output(z.array(z.object({
      name: z.string(),
      description: z.string(),
      category: z.string()
    }))),
  
  getSystemInfo: oc
    .output(z.object({
      platform: z.string(),
      arch: z.string(),
      nodeVersion: z.string(),
      npmVersion: z.string().optional(),
      hostname: z.string(),
      uptime: z.number(),
      memory: z.object({
        total: z.number(),
        free: z.number(),
        used: z.number()
      }),
      cpu: z.object({
        cores: z.number(),
        model: z.string()
      }),
      loadAverage: z.array(z.number())
    })),
  
  getEnvironmentInfo: oc
    .output(z.object({
      nodeEnv: z.string(),
      port: z.number().optional(),
      variables: z.record(z.string(), z.string()),
      paths: z.array(z.string()),
      cwd: z.string()
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
  getBundleInfo: oc
    .output(z.object({
      dependencies: z.number(),
      devDependencies: z.number(),
      peerDependencies: z.number(),
      totalDependencies: z.number(),
      dependencyList: z.object({
        runtime: z.record(z.string(), z.string()),
        development: z.record(z.string(), z.string()),
        peer: z.record(z.string(), z.string())
      }),
      buildInfo: z.any().optional()
    })),
  
  analyzeDependencies: oc
    .output(z.object({
      outdated: z.array(z.object({
        name: z.string(),
        current: z.string(),
        wanted: z.string(),
        latest: z.string(),
        location: z.string().optional()
      })),
      vulnerabilities: z.array(z.object({
        name: z.string(),
        severity: z.enum(['low', 'moderate', 'high', 'critical']),
        via: z.string(),
        title: z.string()
      })),
      summary: z.object({
        total: z.number(),
        outdated: z.number(),
        vulnerabilities: z.number(),
        criticalVulns: z.number()
      })
    })),
  
  getOptimizations: oc
    .output(z.object({
      suggestions: z.array(z.object({
        type: z.string(),
        priority: z.string(),
        description: z.string(),
        impact: z.string(),
        effort: z.string()
      })),
      metrics: z.object({
        bundleScore: z.number(),
        dependencyScore: z.number(),
        securityScore: z.number(),
        overallScore: z.number()
      })
    })),
  
  getDependencyTree: oc
    .output(z.object({
      name: z.string(),
      version: z.string(),
      dependencies: z.array(z.any()),
      depth: z.number()
    })),
  
  getBuildStats: oc
    .output(z.object({
      pages: z.array(z.any()),
      chunks: z.array(z.any()),
      assets: z.array(z.any())
    }))
})

// Logs Plugin Contract
const logsContract = oc.router({
  getLogs: oc
    .input(z.object({ 
      level: z.enum(['error', 'warn', 'info', 'debug']).optional(),
      limit: z.number().optional(),
      source: z.string().optional()
    }).optional())
    .output(z.array(z.object({
      timestamp: z.string(),
      level: z.string(),
      message: z.string(),
      source: z.string().optional(),
      stack: z.string().optional()
    }))),
  
  getProcessLogs: oc
    .output(z.array(z.object({
      timestamp: z.string(),
      type: z.string(),
      message: z.string(),
      details: z.record(z.string(), z.any()).optional()
    }))),
  
  getLogStats: oc
    .output(z.object({
      totalLogs: z.number(),
      errorCount: z.number(),
      warningCount: z.number(),
      infoCount: z.number(),
      debugCount: z.number(),
      averageLogsPerMinute: z.number(),
      lastLogTime: z.string().optional()
    }))
})

// Auth Plugin Contract
const authContract = oc.router({
  getAuthConfig: oc
    .output(z.object({
      configPath: z.string(),
      baseURL: z.string(),
      basePath: z.string(),
      plugins: z.array(z.string()),
      providers: z.array(z.string()),
      configExists: z.boolean()
    })),
  
  getSessionInfo: oc
    .input(z.object({ sessionId: z.string().optional() }).optional())
    .output(z.object({
      sessionId: z.string(),
      userId: z.string(),
      email: z.string(),
      name: z.string(),
      createdAt: z.string(),
      expiresAt: z.string(),
      lastActivity: z.string(),
      ipAddress: z.string(),
      userAgent: z.string(),
      isActive: z.boolean(),
      permissions: z.array(z.string()),
      metadata: z.object({
        loginMethod: z.string(),
        twoFactorEnabled: z.boolean(),
        passkeyRegistered: z.boolean()
      })
    })),
  
  getActiveSessions: oc
    .output(z.array(z.object({
      id: z.string(),
      userId: z.string(),
      createdAt: z.string(),
      lastActivity: z.string(),
      ipAddress: z.string(),
      userAgent: z.string(),
      isActive: z.boolean(),
      location: z.string().optional()
    }))),
  
  getPasskeyInfo: oc
    .output(z.object({
      enabled: z.boolean(),
      registeredKeys: z.array(z.object({
        id: z.string(),
        name: z.string(),
        createdAt: z.string(),
        lastUsed: z.string().optional()
      })),
      supportedTransports: z.array(z.string()),
      settings: z.object({
        requireUserVerification: z.boolean(),
        allowCrossPlatform: z.boolean(),
        timeout: z.number()
      })
    })),
  
  getSecurityEvents: oc
    .output(z.array(z.object({
      id: z.string(),
      type: z.string(),
      timestamp: z.string(),
      ipAddress: z.string(),
      userAgent: z.string(),
      location: z.string(),
      success: z.boolean(),
      details: z.string()
    }))),
  
  getAuthStats: oc
    .output(z.object({
      activeSessions: z.number(),
      totalSessions: z.number(),
      registeredPasskeys: z.number(),
      recentLogins: z.number(),
      successRate: z.number(),
      securityEvents: z.number(),
      suspiciousActivity: z.number(),
      lastLogin: z.string()
    })),
  
  testAuthEndpoints: oc
    .output(z.array(z.object({
      path: z.string(),
      method: z.string(),
      description: z.string(),
      success: z.boolean(),
      status: z.number(),
      duration: z.number(),
      response: z.record(z.string(), z.any())
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