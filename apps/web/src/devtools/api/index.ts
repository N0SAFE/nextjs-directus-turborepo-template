import { createORPCClient } from '@orpc/client'
import { devtoolsContract } from '../contracts/contract'

/**
 * DevTools API client for internal web app communication
 * Uses typed contract for full type safety
 */
export const devToolsApi = createORPCClient({
  url: '/api/devtools',
  contract: devtoolsContract,
})

export type DevToolsApi = typeof devToolsApi