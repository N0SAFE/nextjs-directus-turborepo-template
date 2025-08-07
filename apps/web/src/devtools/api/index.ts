import { createORPCClient } from '@orpc/client'

/**
 * DevTools API client for internal web app communication
 * Uses direct HTTP calls to /api/devtools without contract for simplicity
 * Type safety is achieved through the enhanced API hook
 */
export const devToolsApi = createORPCClient({
  url: '/api/devtools',
})

export type DevToolsApi = typeof devToolsApi