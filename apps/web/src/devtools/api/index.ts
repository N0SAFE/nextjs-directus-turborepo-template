import { orpc } from '@/lib/orpc'

/**
 * DevTools API client for server communication
 */
export const devToolsApi = {
  // CLI operations
  cli: {
    execute: orpc.devtools.cli.execute,
    getScripts: orpc.devtools.cli.getScripts,
    runScript: orpc.devtools.cli.runScript,
  },

  // File system operations
  files: {
    list: orpc.devtools.files.list,
    read: orpc.devtools.files.read,
    exists: orpc.devtools.files.exists,
  },

  // System information
  system: {
    info: orpc.devtools.system.info,
    environment: orpc.devtools.system.environment,
    cwd: orpc.devtools.system.cwd,
  },

  // Project analysis
  project: {
    packageInfo: orpc.devtools.project.packageInfo,
    buildInfo: orpc.devtools.project.buildInfo,
    routes: orpc.devtools.project.routes,
    workspaces: orpc.devtools.project.workspaces,
  },

  // Development tools
  dev: {
    clearCache: orpc.devtools.dev.clearCache,
    hotReload: orpc.devtools.dev.hotReload,
    logs: orpc.devtools.dev.logs,
  },
}

export type DevToolsApi = typeof devToolsApi