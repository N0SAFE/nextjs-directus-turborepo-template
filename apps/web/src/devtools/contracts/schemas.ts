import { oc } from "@orpc/contract";

// CLI command schemas
export const cliCommandSchema = oc.object({
  command: oc.string(),
  args: oc.array(oc.string()).optional(),
  cwd: oc.string().optional(),
  timeout: oc.number().optional(),
});

export const cliCommandResultSchema = oc.object({
  success: oc.boolean(),
  output: oc.string(),
  error: oc.string().optional(),
  exitCode: oc.number().optional(),
  duration: oc.number(),
});

// File system schemas
export const directoryListingSchema = oc.object({
  path: oc.string(),
  files: oc.array(oc.object({
    name: oc.string(),
    path: oc.string(),
    type: oc.enum(['file', 'directory']),
    size: oc.number().optional(),
    modified: oc.string().optional(),
    isHidden: oc.boolean(),
  })),
  totalFiles: oc.number(),
  totalDirectories: oc.number(),
});

export const fileContentSchema = oc.object({
  path: oc.string(),
  content: oc.string(),
  encoding: oc.string(),
  size: oc.number(),
  modified: oc.string(),
});

// System information schemas
export const systemInfoSchema = oc.object({
  platform: oc.string(),
  arch: oc.string(),
  nodeVersion: oc.string(),
  npmVersion: oc.string().optional(),
  hostname: oc.string(),
  uptime: oc.number(),
  memory: oc.object({
    total: oc.number(),
    free: oc.number(),
    used: oc.number(),
  }),
  cpu: oc.object({
    cores: oc.number(),
    model: oc.string(),
  }),
});

export const environmentInfoSchema = oc.object({
  nodeEnv: oc.string(),
  port: oc.number().optional(),
  variables: oc.record(oc.string()),
  paths: oc.array(oc.string()),
});

// Project analysis schemas
export const packageInfoSchema = oc.object({
  name: oc.string(),
  version: oc.string(),
  description: oc.string().optional(),
  scripts: oc.record(oc.string()),
  dependencies: oc.record(oc.string()),
  devDependencies: oc.record(oc.string()),
  peerDependencies: oc.record(oc.string()).optional(),
  workspaces: oc.array(oc.string()).optional(),
});

export const buildInfoSchema = oc.object({
  nextVersion: oc.string().optional(),
  buildTime: oc.string().optional(),
  buildSize: oc.object({
    total: oc.number(),
    assets: oc.number(),
    pages: oc.number(),
  }).optional(),
  bundleAnalysis: oc.object({
    chunks: oc.array(oc.object({
      name: oc.string(),
      size: oc.number(),
      modules: oc.number(),
    })),
    totalSize: oc.number(),
    largestChunks: oc.array(oc.string()),
  }).optional(),
});

export const routesAnalysisSchema = oc.object({
  routes: oc.array(oc.object({
    path: oc.string(),
    type: oc.enum(['page', 'api', 'middleware']),
    dynamic: oc.boolean(),
    params: oc.array(oc.string()).optional(),
    methods: oc.array(oc.string()).optional(),
  })),
  totalRoutes: oc.number(),
  apiRoutes: oc.number(),
  pageRoutes: oc.number(),
  dynamicRoutes: oc.number(),
});