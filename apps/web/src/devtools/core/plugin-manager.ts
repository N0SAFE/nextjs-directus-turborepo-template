import { DevToolPlugin } from '../types'
import { routesPlugin, bundlesPlugin, cliPlugin, logsPlugin } from '../core/plugins'

/**
 * Plugin manager for server-side access to DevTool plugins
 * This provides a way to access plugins from API routes and server components
 */
class DevToolPluginManager {
  private static instance: DevToolPluginManager | null = null
  private plugins: Map<string, DevToolPlugin> = new Map()
  private corePlugins: DevToolPlugin[] = [routesPlugin, bundlesPlugin, cliPlugin, logsPlugin]

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
   * Get all registered plugins as an array
   */
  getAllPlugins(): DevToolPlugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Get core plugins only
   */
  getCorePlugins(): DevToolPlugin[] {
    return this.corePlugins
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
    for (const [pluginId] of this.plugins) {
      if (!corePluginIds.has(pluginId)) {
        this.plugins.delete(pluginId)
      }
    }
  }
}

// Export singleton instance
export const devToolPluginManager = DevToolPluginManager.getInstance()