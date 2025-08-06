import { 
  createCliHandlers, 
  CLI_HANDLER_ID,
  createRoutesHandlers,
  ROUTES_HANDLER_ID,
  createBundlesHandlers,
  BUNDLES_HANDLER_ID,
  createAuthHandlers,
  AUTH_HANDLER_ID,
  createLogsHandlers,
  LOGS_HANDLER_ID
} from '../orpc-handlers'

/**
 * ORPC Router Entry - represents a router with its handler factory and identifier
 */
export interface OrpcRouterEntry {
  /** Unique identifier for this router */
  identifier: string
  /** Factory function to create handlers with injected services */
  handlerFactory: (services: Record<string, unknown>) => Record<string, unknown>
  /** Human-readable name for debugging */
  name: string
  /** Optional description */
  description?: string
}

/**
 * List of all available ORPC routers in the DevTool system
 * This registry maps handler identifiers to their corresponding handler factories
 */
export const allOrpcRouterList: OrpcRouterEntry[] = [
  {
    identifier: CLI_HANDLER_ID,
    handlerFactory: createCliHandlers,
    name: 'CLI Handler',
    description: 'Handles CLI commands, scripts, and environment operations'
  },
  {
    identifier: ROUTES_HANDLER_ID,
    handlerFactory: createRoutesHandlers,
    name: 'Routes Handler', 
    description: 'Handles route analysis and API information'
  },
  {
    identifier: BUNDLES_HANDLER_ID,
    handlerFactory: createBundlesHandlers,
    name: 'Bundles Handler',
    description: 'Handles bundle analysis and build information'
  },
  {
    identifier: AUTH_HANDLER_ID,
    handlerFactory: createAuthHandlers,
    name: 'Auth Handler',
    description: 'Handles authentication, sessions, and security operations'
  },
  {
    identifier: LOGS_HANDLER_ID,
    handlerFactory: createLogsHandlers,
    name: 'Logs Handler',
    description: 'Handles application logs and system monitoring'
  }
]

/**
 * Get an ORPC router entry by identifier
 */
export function getOrpcRouterById(identifier: string): OrpcRouterEntry | undefined {
  return allOrpcRouterList.find(router => router.identifier === identifier)
}

/**
 * Get all available ORPC router identifiers
 */
export function getAllOrpcRouterIds(): string[] {
  return allOrpcRouterList.map(router => router.identifier)
}