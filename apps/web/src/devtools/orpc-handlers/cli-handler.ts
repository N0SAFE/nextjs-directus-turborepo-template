import { SERVICE_KEYS } from '../services/registry'

/**
 * CLI Plugin ORPC Handler Factory (uses dependency injection)
 * Creates handlers for CLI operations with injected DevtoolsService
 */
export function createCliHandlers(services: Record<string, unknown>) {
  const devtoolsService = services[SERVICE_KEYS.DEVTOOLS_SERVICE] as any
  
  if (!devtoolsService) {
    console.warn('[CLI Plugin] DevtoolsService not found in dependency injection')
    return {
      execute: async () => ({ success: false, output: '', error: 'Service not available', exitCode: 1, duration: 0 }),
      getScripts: async () => ({}),
      runScript: async () => ({ success: false, output: '', error: 'Service not available', exitCode: 1, duration: 0 }),
    }
  }

  return {
    execute: async (input: unknown) => devtoolsService.executeCommand(input),
    getScripts: async () => devtoolsService.getScripts(),
    runScript: async (input: any) => devtoolsService.runScript(input.script, input.args),
  }
}

// Export unique identifier for this handler
export const CLI_HANDLER_ID = 'cli-handler'