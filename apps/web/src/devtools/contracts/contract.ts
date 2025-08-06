import { oc } from "@orpc/contract";
import {
  cliCommandSchema,
  cliCommandResultSchema,
  directoryListingSchema,
  fileContentSchema,
  systemInfoSchema,
  environmentInfoSchema,
  packageInfoSchema,
  buildInfoSchema,
  routesAnalysisSchema,
} from "./schemas";

// DevTools contract for server communication within the web app
export const devtoolsContract = oc.router({
  // CLI operations
  cli: oc.router({
    // Execute a CLI command
    execute: oc
      .input(cliCommandSchema)
      .output(cliCommandResultSchema)
      .func(),

    // Get available npm scripts
    getScripts: oc
      .output(oc.record(oc.string()))
      .func(),

    // Execute an npm script
    runScript: oc
      .input(oc.object({
        script: oc.string(),
        args: oc.array(oc.string()).optional(),
      }))
      .output(cliCommandResultSchema)
      .func(),
  }),

  // File system operations  
  files: oc.router({
    // List directory contents
    list: oc
      .input(oc.object({
        path: oc.string().optional(),
        includeHidden: oc.boolean().optional(),
        maxDepth: oc.number().optional(),
      }))
      .output(directoryListingSchema)
      .func(),

    // Read file content
    read: oc
      .input(oc.object({
        path: oc.string(),
        encoding: oc.string().optional(),
      }))
      .output(fileContentSchema)
      .func(),

    // Check if file/directory exists
    exists: oc
      .input(oc.object({
        path: oc.string(),
      }))
      .output(oc.boolean())
      .func(),
  }),

  // System information
  system: oc.router({
    // Get system information
    info: oc
      .output(systemInfoSchema)
      .func(),

    // Get environment information
    environment: oc
      .output(environmentInfoSchema)
      .func(),

    // Get current working directory
    cwd: oc
      .output(oc.string())
      .func(),
  }),

  // Project analysis
  project: oc.router({
    // Get package.json information
    packageInfo: oc
      .input(oc.object({
        path: oc.string().optional(),
      }))
      .output(packageInfoSchema)
      .func(),

    // Get build information
    buildInfo: oc
      .output(buildInfoSchema)
      .func(),

    // Analyze project routes
    routes: oc
      .output(routesAnalysisSchema)
      .func(),

    // Get workspace information (for monorepos)
    workspaces: oc
      .output(oc.array(oc.object({
        name: oc.string(),
        path: oc.string(),
        packageInfo: packageInfoSchema,
      })))
      .func(),
  }),

  // Development tools
  dev: oc.router({
    // Clear cache
    clearCache: oc
      .input(oc.object({
        type: oc.enum(['npm', 'next', 'all']).optional(),
      }))
      .output(oc.object({
        success: oc.boolean(),
        message: oc.string(),
        clearedPaths: oc.array(oc.string()),
      }))
      .func(),

    // Hot reload status
    hotReload: oc
      .output(oc.object({
        enabled: oc.boolean(),
        mode: oc.string(),
        lastReload: oc.string().optional(),
      }))
      .func(),

    // Get error logs
    logs: oc
      .input(oc.object({
        level: oc.enum(['error', 'warn', 'info', 'debug']).optional(),
        limit: oc.number().optional(),
        since: oc.string().optional(),
      }))
      .output(oc.array(oc.object({
        level: oc.string(),
        message: oc.string(),
        timestamp: oc.string(),
        source: oc.string().optional(),
      })))
      .func(),
  }),
});

export type DevtoolsContract = typeof devtoolsContract;