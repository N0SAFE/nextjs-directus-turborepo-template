// Server-side plugin definitions (metadata + ORPC contracts only)
// This file can be safely imported on the server side without React/JSX dependencies

import { PluginMetadata } from '../../types'
import { CLI_HANDLER_ID, ROUTES_HANDLER_ID, BUNDLES_HANDLER_ID, AUTH_HANDLER_ID, LOGS_HANDLER_ID } from '../../orpc-handlers/constants'

/**
 * Server-side plugin definition interface
 */
export interface ServerPluginDefinition {
  metadata: PluginMetadata
  orpc?: {
    identifier: string
  }
  enabled: boolean
}

/**
 * Core plugin server definitions
 */
export const corePluginServerDefinitions: readonly ServerPluginDefinition[] = [
  {
    metadata: {
      id: 'core-routes',
      name: 'Routes',
      version: '1.0.0',
      description: 'Route management and API endpoint overview',
      author: 'DevTools Core',
      icon: 'Map',
    },
    orpc: {
      identifier: ROUTES_HANDLER_ID
    },
    enabled: true
  },
  {
    metadata: {
      id: 'core-bundles',
      name: 'Bundles',
      version: '1.0.0',
      description: 'Bundle analysis, dependencies, and build optimization',
      author: 'DevTools Core',
      icon: 'Package',
    },
    orpc: {
      identifier: BUNDLES_HANDLER_ID
    },
    enabled: true
  },
  {
    metadata: {
      id: 'core-cli',
      name: 'CLI',
      version: '1.0.0',
      description: 'CLI commands, scripts, and environment information',
      author: 'DevTools Core',
      icon: 'Terminal',
    },
    orpc: {
      identifier: CLI_HANDLER_ID
    },
    enabled: true
  },
  {
    metadata: {
      id: 'core-logs',
      name: 'Logs',
      version: '1.0.0',
      description: 'Application logs, monitoring, and process information',
      author: 'DevTools Core',
      icon: 'ScrollText',
    },
    orpc: {
      identifier: LOGS_HANDLER_ID
    },
    enabled: true
  },
  {
    metadata: {
      id: 'core-auth',
      name: 'Authentication',
      version: '1.0.0',
      description: 'User authentication and session management',
      author: 'DevTools Core',
      icon: 'Shield',
    },
    orpc: {
      identifier: AUTH_HANDLER_ID
    },
    enabled: true
  }
] as const

/**
 * Get all core plugin server definitions
 */
export function getCorePluginServerDefinitions(): readonly ServerPluginDefinition[] {
  return corePluginServerDefinitions
}

/**
 * Get a specific core plugin server definition by ID
 */
export function getCorePluginServerDefinition(id: string): ServerPluginDefinition | undefined {
  return corePluginServerDefinitions.find(plugin => plugin.metadata.id === id)
}

/**
 * Get all ORPC identifiers from core plugins
 */
export function getCorePluginOrpcIdentifiers(): string[] {
  return corePluginServerDefinitions
    .filter(plugin => plugin.orpc?.identifier)
    .map(plugin => plugin.orpc!.identifier)
}