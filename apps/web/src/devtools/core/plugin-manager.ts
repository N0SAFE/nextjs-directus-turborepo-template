import { DevToolPlugin } from '../types'
import { corePluginServerDefinitions, ServerPluginDefinition } from './plugins/server-definitions'

// Convert server definitions to DevToolPlugin format for compatibility
function createPluginFromServerDefinition(def: ServerPluginDefinition): DevToolPlugin {
  return {
    metadata: def.metadata,
    groups: [], // Server-side doesn't need groups (React components)
    enabled: def.enabled,
    orpc: def.orpc
  }
}

// Convert server definitions to DevToolPlugin objects
const corePluginsList = corePluginServerDefinitions.map(createPluginFromServerDefinition)

// Define specific types for each core plugin based on their contracts
type CliPlugin = DevToolPlugin & {
  metadata: { id: 'core-cli' }
  orpc: { identifier: 'cli-handler' }
}

type RoutesPlugin = DevToolPlugin & {
  metadata: { id: 'core-routes' }
  orpc: { identifier: 'routes-handler' }
}

type BundlesPlugin = DevToolPlugin & {
  metadata: { id: 'core-bundles' }
  orpc: { identifier: 'bundles-handler' }
}

type LogsPlugin = DevToolPlugin & {
  metadata: { id: 'core-logs' }
  orpc: { identifier: 'logs-handler' }
}

type AuthPlugin = DevToolPlugin & {
  metadata: { id: 'core-auth' }
  orpc: { identifier: 'auth-handler' }
}

// Core plugins tuple type for strongly typed returns
type CorePluginsTuple = readonly [RoutesPlugin, BundlesPlugin, CliPlugin, LogsPlugin, AuthPlugin]

// Union type for individual core plugins
type CorePluginTypes = CliPlugin | RoutesPlugin | BundlesPlugin | LogsPlugin | AuthPlugin

/**
 * Plugin manager for server-side access to DevTool plugins
 * This provides a way to access plugins from API routes and server components
 */
class DevToolPluginManager {
  private static instance: DevToolPluginManager | null = null
  private plugins: Map<string, DevToolPlugin> = new Map()
  private corePlugins: readonly DevToolPlugin[] = corePluginsList

  private constructor() {
    // Register core plugins on instantiation - using server definitions
    this.corePlugins.forEach((plugin, index) => {
      if (!plugin) {
        console.error(`[DevToolPluginManager] Plugin at index ${index} is undefined`)
        return
      }
      if (!plugin.metadata) {
        console.error(`[DevToolPluginManager] Plugin at index ${index} has no metadata:`, plugin)
        return
      }
      if (!plugin.metadata.id) {
        console.error(`[DevToolPluginManager] Plugin at index ${index} has no metadata.id:`, plugin.metadata)
        return
      }
      this.plugins.set(plugin.metadata.id, plugin)
    })
  }

  static getInstance(): DevToolPluginManager {
    if (!DevToolPluginManager.instance) {
      DevToolPluginManager.instance = new DevToolPluginManager()
    }
    return DevToolPluginManager.instance
  }

  /**
   * Register a plugin
   */
  registerPlugin(plugin: DevToolPlugin): void {
    this.plugins.set(plugin.metadata.id, plugin)
  }

  /**
   * Unregister a plugin
   */
  unregisterPlugin(pluginId: string): void {
    this.plugins.delete(pluginId)
  }

  /**
   * Get all registered plugins as an array with their specific types
   */
  getAllPlugins(): DevToolPlugin[] {
    console.debug('[DevToolPluginManager] Getting all plugins')
    console.debug('[DevToolPluginManager] Core plugins:', this.corePlugins.map(p => p.metadata.id))
    return Array.from(this.plugins.values())
  }

  /**
   * Get core plugins only with their specific types
   */
  getCorePlugins(): readonly CorePluginTypes[] {
    return this.corePlugins as readonly CorePluginTypes[]
  }

  /**
   * Get core plugins with strongly typed return as tuple
   */
  getTypedCorePlugins(): CorePluginsTuple {
    // Return core plugins in a specific order for type safety
    const routesPlugin = this.plugins.get('core-routes') as RoutesPlugin
    const bundlesPlugin = this.plugins.get('core-bundles') as BundlesPlugin
    const cliPlugin = this.plugins.get('core-cli') as CliPlugin
    const logsPlugin = this.plugins.get('core-logs') as LogsPlugin
    const authPlugin = this.plugins.get('core-auth') as AuthPlugin
    
    return [routesPlugin, bundlesPlugin, cliPlugin, logsPlugin, authPlugin] as const
  }

  /**
   * Get a specific core plugin by ID with proper typing
   */
  getCorePlugin<T extends CorePluginTypes['metadata']['id']>(
    pluginId: T
  ): T extends 'core-cli' ? CliPlugin :
     T extends 'core-routes' ? RoutesPlugin :
     T extends 'core-bundles' ? BundlesPlugin :
     T extends 'core-logs' ? LogsPlugin :
     T extends 'core-auth' ? AuthPlugin :
     never {
    const plugin = this.plugins.get(pluginId)
    if (plugin && this.corePlugins.some(cp => cp.metadata.id === pluginId)) {
      return plugin as any
    }
    throw new Error(`Core plugin '${pluginId}' not found`)
  }

  /**
   * Get additional (non-core) plugins
   */
  getAdditionalPlugins(): DevToolPlugin[] {
    const corePluginIds = new Set(this.corePlugins.map(p => p.metadata.id))
    return Array.from(this.plugins.values()).filter(p => !corePluginIds.has(p.metadata.id))
  }

  /**
   * Get a specific plugin by ID
   */
  getPlugin(pluginId: string): DevToolPlugin | undefined {
    return this.plugins.get(pluginId)
  }

  /**
   * Check if a plugin is registered
   */
  hasPlugin(pluginId: string): boolean {
    return this.plugins.has(pluginId)
  }

  /**
   * Clear all additional plugins (keep core plugins)
   */
  clearAdditionalPlugins(): void {
    const corePluginIds = new Set(this.corePlugins.map(p => p.metadata.id))
    const pluginEntries = Array.from(this.plugins.entries())
    for (const [pluginId] of pluginEntries) {
      if (!corePluginIds.has(pluginId)) {
        this.plugins.delete(pluginId)
      }
    }
  }

  /**
   * Get plugins with ORPC contracts for type-safe contract generation
   * Returns all core plugins since they all have ORPC contracts
   */
  getOrpcPlugins(): readonly CorePluginTypes[] {
    // All core plugins have ORPC contracts, so return them with proper typing
    return this.getCorePlugins()
  }

  /**
   * Get plugins with ORPC identifiers for service injection
   */
  getOrpcEnabledPlugins(): DevToolPlugin[] {
    return Array.from(this.plugins.values()).filter(plugin => plugin.orpc?.identifier)
  }
}

// Export singleton instance
export const devToolPluginManager = DevToolPluginManager.getInstance()

// Export types for external use
export type { 
  CorePluginTypes, 
  CorePluginsTuple,
  CliPlugin,
  RoutesPlugin,
  BundlesPlugin,
  LogsPlugin,
  AuthPlugin
}