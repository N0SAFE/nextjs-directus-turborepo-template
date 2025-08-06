import z from "zod/v4";

// CLI command schemas
export const cliCommandSchema = z.object({
  command: z.string(),
  args: z.array(z.string()).optional(),
  cwd: z.string().optional(),
  timeout: z.number().optional(),
});

export const cliCommandResultSchema = z.object({
  success: z.boolean(),
  output: z.string(),
  error: z.string().optional(),
  exitCode: z.number().optional(),
  duration: z.number(),
});

// File system schemas
export const directoryListingSchema = z.object({
  path: z.string(),
  files: z.array(z.object({
    name: z.string(),
    path: z.string(),
    type: z.enum(['file', 'directory']),
    size: z.number().optional(),
    modified: z.string().optional(),
    isHidden: z.boolean(),
  })),
  totalFiles: z.number(),
  totalDirectories: z.number(),
});

export const fileContentSchema = z.object({
  path: z.string(),
  content: z.string(),
  encoding: z.string(),
  size: z.number(),
  modified: z.string(),
});

// System information schemas
export const systemInfoSchema = z.object({
  platform: z.string(),
  arch: z.string(),
  nodeVersion: z.string(),
  npmVersion: z.string().optional(),
  hostname: z.string(),
  uptime: z.number(),
  memory: z.object({
    total: z.number(),
    free: z.number(),
    used: z.number(),
  }),
  cpu: z.object({
    cores: z.number(),
    model: z.string(),
  }),
});

export const environmentInfoSchema = z.object({
  nodeEnv: z.string(),
  port: z.number().optional(),
  variables: z.record(z.string(), z.string()),
  paths: z.array(z.string()),
});

// Project analysis schemas
export const packageInfoSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  scripts: z.record(z.string(), z.string()),
  dependencies: z.record(z.string(), z.string()),
  devDependencies: z.record(z.string(), z.string()),
  peerDependencies: z.record(z.string(), z.string()).optional(),
  workspaces: z.array(z.string()).optional(),
});

export const buildInfoSchema = z.object({
  nextVersion: z.string().optional(),
  buildTime: z.string().optional(),
  buildSize: z.object({
    total: z.number(),
    assets: z.number(),
    pages: z.number(),
  }).optional(),
  bundleAnalysis: z.object({
    chunks: z.array(z.object({
      name: z.string(),
      size: z.number(),
      modules: z.number(),
    })),
    totalSize: z.number(),
    largestChunks: z.array(z.string()),
  }).optional(),
});

export const routesAnalysisSchema = z.object({
  routes: z.array(z.object({
    path: z.string(),
    type: z.enum(['page', 'api', 'middleware']),
    dynamic: z.boolean(),
    params: z.array(z.string()).optional(),
    methods: z.array(z.string()).optional(),
  })),
  totalRoutes: z.number(),
  apiRoutes: z.number(),
  pageRoutes: z.number(),
  dynamicRoutes: z.number(),
});

// Additional routes schemas
export const routeInfoSchema = z.object({
  path: z.string(),
  name: z.string(),
  params: z.record(z.string(), z.string()),
  query: z.record(z.string(), z.string()),
});

export const routeAnalysisSchema = z.object({
  path: z.string(),
  component: z.string(),
  dependencies: z.array(z.string()),
  size: z.string(),
  performance: z.string(),
});

export const routesListSchema = z.object({
  pages: z.array(z.object({
    path: z.string(),
    name: z.string(),
  })),
  apiRoutes: z.array(z.object({
    path: z.string(),
    method: z.string(),
  })),
});

// Bundle analysis schemas
export const bundleInfoSchema = z.object({
  client: z.object({
    size: z.string(),
    gzipped: z.string(),
    files: z.array(z.object({
      name: z.string(),
      size: z.string(),
    })),
  }),
  server: z.object({
    size: z.string(),
    files: z.array(z.object({
      name: z.string(),
      size: z.string(),
    })),
  }),
  total: z.string(),
});

export const dependencyAnalysisSchema = z.object({
  production: z.object({
    count: z.number(),
    size: z.string(),
    packages: z.array(z.string()),
  }),
  development: z.object({
    count: z.number(),
    size: z.string(),
    packages: z.array(z.string()),
  }),
  outdated: z.array(z.object({
    name: z.string(),
    current: z.string(),
    latest: z.string(),
  })),
});

export const optimizationSuggestionsSchema = z.object({
  suggestions: z.array(z.object({
    type: z.string(),
    description: z.string(),
    impact: z.string(),
  })),
  score: z.number(),
});