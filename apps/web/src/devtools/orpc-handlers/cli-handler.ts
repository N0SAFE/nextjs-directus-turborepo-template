import { SERVICE_KEYS } from '../services/registry'

/**
 * CLI Plugin ORPC Handler Factory (uses dependency injection)
 * Creates handlers for CLI operations with injected DevtoolsService
 */
export function createCliHandlers(services: Record<string, unknown>) {
  const devtoolsService = services[SERVICE_KEYS.DEVTOOLS_SERVICE] as any
  
  if (!devtoolsService) {
    console.warn('[CLI Plugin] DevtoolsService not found in dependency injection')
    const fallbackResult = { success: false, output: '', error: 'Service not available', exitCode: 1, duration: 0 }
    return {
      execute: async () => fallbackResult,
      executeStream: async () => fallbackResult,
      getScripts: async () => ({}),
      runScript: async () => fallbackResult,
      getAvailableCommands: async () => ([]),
      getSystemInfo: async () => ({
        platform: 'unknown',
        arch: 'unknown',
        nodeVersion: 'unknown',
        hostname: 'unknown',
        uptime: 0,
        memory: { total: 0, free: 0, used: 0 },
        cpu: { cores: 0, model: 'unknown' },
        loadAverage: [0, 0, 0],
      }),
      getEnvironmentInfo: async () => ({
        nodeEnv: 'unknown',
        variables: {},
        paths: [],
        cwd: 'unknown',
      }),
    }
  }

  return {
    execute: async (input: unknown) => devtoolsService.executeCommand(input),
    executeStream: async (input: unknown) => devtoolsService.executeCommandStream(input),
    getScripts: async () => devtoolsService.getScripts(),
    runScript: async (input: any) => devtoolsService.runScript(input.script, input.args),
    getAvailableCommands: async () => devtoolsService.getAvailableCommands(),
    getSystemInfo: async () => devtoolsService.getSystemInfo(),
    getEnvironmentInfo: async () => devtoolsService.getEnvironmentInfo(),
  }
}

// Export unique identifier for this handler
export const CLI_HANDLER_ID = 'cli-handler'