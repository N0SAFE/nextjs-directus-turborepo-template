import { createORPCClient } from '@orpc/client'

/**
 * DevTools API client for internal web app communication
 * Created without contract to avoid circular dependencies
 * Type safety is achieved through the enhanced API hook
 */
export const devToolsApi = createORPCClient({
  url: '/api/devtools',
})

export type DevToolsApi = typeof devToolsApi