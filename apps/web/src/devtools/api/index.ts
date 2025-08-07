import { createORPCClient } from '@orpc/client'

/**
 * DevTools API client for internal web app communication
 */
export const devToolsApi = createORPCClient({
  url: '/api/devtools',
})

export type DevToolsApi = typeof devToolsApi