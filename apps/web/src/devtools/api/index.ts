import { createORPCClient } from '@orpc/client'
import { devtoolsContract } from '../contracts'

/**
 * DevTools API client for internal web app communication
 * Uses fetch-based link for local API communication
 */
export const devToolsApi = createORPCClient({
  baseURL: '/api/devtools',
})

export type DevToolsApi = typeof devToolsApi