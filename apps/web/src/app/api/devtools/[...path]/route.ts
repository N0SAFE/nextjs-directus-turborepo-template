import { createORPCNext } from '@orpc/next'
import { devtoolsContract } from '../../../../devtools/contracts'
import { DevtoolsService } from '../../../../devtools/services/devtools.service'

const devtoolsService = new DevtoolsService()

const orpc = createORPCNext()

export const { GET, POST } = orpc.router(devtoolsContract, {
  cli: {
    execute: async (input) => devtoolsService.executeCommand(input),
    getScripts: async () => devtoolsService.getScripts(),
    runScript: async (input) => devtoolsService.runScript(input.script, input.args),
  },
  system: {
    info: async () => devtoolsService.getSystemInfo(),
    environment: async () => devtoolsService.getEnvironmentInfo(),
    cwd: async () => process.cwd(),
  },
  files: {
    list: async () => ({ path: '', files: [], totalFiles: 0, totalDirectories: 0 }),
    read: async () => ({ path: '', content: '', encoding: 'utf-8', size: 0, modified: '' }),
    exists: async () => false,
  },
  project: {
    packageInfo: async () => ({ name: '', version: '', scripts: {}, dependencies: {}, devDependencies: {} }),
    buildInfo: async () => ({}),
    routes: async () => ({ routes: [], totalRoutes: 0, apiRoutes: 0, pageRoutes: 0, dynamicRoutes: 0 }),
    workspaces: async () => [],
  },
  dev: {
    clearCache: async () => ({ success: true, message: 'Cache cleared', clearedPaths: [] }),
    hotReload: async () => ({ enabled: true, mode: 'development' }),
    logs: async () => [],
  },
})