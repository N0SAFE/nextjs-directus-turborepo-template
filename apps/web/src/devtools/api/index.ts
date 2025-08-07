import { createORPCClient } from '@orpc/client'
import { devtoolsContract } from '../contracts/contract'

/**
 * DevTools API client for internal web app communication
 * Now uses the static contract for full type safety
 */
export const devToolsApi = createORPCClient(devtoolsContract, {
  url: '/api/devtools',
})

export type DevToolsApi = typeof devToolsApi