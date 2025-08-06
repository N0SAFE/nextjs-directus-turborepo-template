import { createORPCClient } from '@orpc/client'
import { devtoolsContract } from '../contracts'

/**
 * DevTools API client for internal web app communication
 */
export const devToolsApi = createORPCClient<typeof devtoolsContract>({
  baseURL: '/api/devtools',
})

export type DevToolsApi = typeof devToolsApi