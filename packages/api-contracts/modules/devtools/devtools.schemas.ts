import { z } from "zod";

// CLI command schemas
export const cliCommandSchema = z.object({
  command: z.string().min(1, "Command is required"),
  args: z.array(z.string()).optional(),
  cwd: z.string().optional(),
  env: z.record(z.string()).optional(),
});

export const cliCommandResultSchema = z.object({
  success: z.boolean(),
  stdout: z.string(),
  stderr: z.string(),
  exitCode: z.number(),
  duration: z.number(),
  command: z.string(),
});

// File system schemas
export const fileInfoSchema = z.object({
  name: z.string(),
  path: z.string(),
  size: z.number(),
  isDirectory: z.boolean(),
  modifiedAt: z.string(),
  extension: z.string().optional(),
});

export const directoryListingSchema = z.object({
  path: z.string(),
  files: z.array(fileInfoSchema),
  totalFiles: z.number(),
  totalDirectories: z.number(),
});

export const fileContentSchema = z.object({
  path: z.string(),
  content: z.string(),
  encoding: z.string(),
  size: z.number(),
});

// System info schemas
export const systemInfoSchema = z.object({
  platform: z.string(),
  arch: z.string(),
  nodeVersion: z.string(),
  npmVersion: z.string(),
  memory: z.object({
    total: z.number(),
    free: z.number(),
    used: z.number(),
  }),
  cpu: z.object({
    model: z.string(),
    cores: z.number(),
    usage: z.number().optional(),
  }),
  uptime: z.number(),
});

export const environmentInfoSchema = z.object({
  nodeEnv: z.string(),
  variables: z.record(z.string()),
  processId: z.number(),
  workingDirectory: z.string(),
});

// Project info schemas
export const packageInfoSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  scripts: z.record(z.string()),
  dependencies: z.record(z.string()),
  devDependencies: z.record(z.string()).optional(),
  workspaces: z.array(z.string()).optional(),
});

export const buildInfoSchema = z.object({
  buildTime: z.string().optional(),
  buildSize: z.number().optional(),
  bundleSize: z.object({
    total: z.number(),
    gzipped: z.number(),
    chunks: z.array(z.object({
      name: z.string(),
      size: z.number(),
      gzipped: z.number(),
    })),
  }).optional(),
  dependencies: z.array(z.object({
    name: z.string(),
    version: z.string(),
    size: z.number().optional(),
  })).optional(),
});

export const routeInfoSchema = z.object({
  path: z.string(),
  method: z.string().optional(),
  handler: z.string().optional(),
  middlewares: z.array(z.string()).optional(),
  params: z.array(z.string()).optional(),
  isProtected: z.boolean().optional(),
});

export const routesAnalysisSchema = z.object({
  routes: z.array(routeInfoSchema),
  totalRoutes: z.number(),
  apiRoutes: z.number(),
  pageRoutes: z.number(),
  protectedRoutes: z.number(),
});

// Export types for TypeScript
export type CliCommand = z.infer<typeof cliCommandSchema>;
export type CliCommandResult = z.infer<typeof cliCommandResultSchema>;
export type FileInfo = z.infer<typeof fileInfoSchema>;
export type DirectoryListing = z.infer<typeof directoryListingSchema>;
export type FileContent = z.infer<typeof fileContentSchema>;
export type SystemInfo = z.infer<typeof systemInfoSchema>;
export type EnvironmentInfo = z.infer<typeof environmentInfoSchema>;
export type PackageInfo = z.infer<typeof packageInfoSchema>;
export type BuildInfo = z.infer<typeof buildInfoSchema>;
export type RouteInfo = z.infer<typeof routeInfoSchema>;
export type RoutesAnalysis = z.infer<typeof routesAnalysisSchema>;