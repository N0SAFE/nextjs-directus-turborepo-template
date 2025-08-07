import { DevToolPlugin } from '../types'
import { routesPlugin, bundlesPlugin, cliPlugin, logsPlugin, authPlugin } from '../core/plugins'

// Define the specific core plugins tuple for better typing
const corePluginsList = [routesPlugin, bundlesPlugin, cliPlugin, logsPlugin, authPlugin] as const

// Extract the specific types from the core plugins
type CorePluginTypes = typeof corePluginsList[number]

/**
 * Plugin manager for server-side access to DevTool plugins
 * This provides a way to access plugins from API routes and server components
 */
class DevToolPluginManager {
  private static instance: DevToolPluginManager | null = null
  private plugins: Map<string, DevToolPlugin> = new Map()
  private corePlugins: readonly DevToolPlugin[] = corePluginsList

  private constructor() {
    // Register core plugins on instantiation
    this.corePlugins.forEach(plugin => {
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
  getCorePlugins(): readonly DevToolPlugin[] {
    return this.corePlugins
  }

  /**
   * Get core plugins with strongly typed return
   */
  getTypedCorePlugins(): readonly CorePluginTypes[] {
    return corePluginsList
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
   * Get a specific core plugin by ID with proper typing
   */
  getCorePlugin<T extends CorePluginTypes>(pluginId: T['metadata']['id']): T | undefined {
    const plugin = this.plugins.get(pluginId)
    if (plugin && this.corePlugins.some(cp => cp.metadata.id === pluginId)) {
      return plugin as T
    }
    return undefined
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
    for (const [pluginId] of this.plugins) {
      if (!corePluginIds.has(pluginId)) {
        this.plugins.delete(pluginId)
      }
    }
  }

  /**
   * Get plugins with ORPC contracts for type-safe contract generation
   */
  getOrpcPlugins(): DevToolPlugin[] {
    return Array.from(this.plugins.values()).filter(plugin => plugin.orpc?.contract)
  }
}

// Export singleton instance
export const devToolPluginManager = DevToolPluginManager.getInstance()

// Export types for external use
export type { CorePluginTypes }