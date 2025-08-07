import { createORPCClient } from '@orpc/client'
import { devtoolsContract } from '../contracts'

/**
 * DevTools API client for internal web app communication
 * Uses the DevTools contract for full type safety
 */
export const devToolsApi = createORPCClient<typeof devtoolsContract>({
  endpoint: '/api/devtools',
})

export type DevToolsApi = typeof devToolsApi