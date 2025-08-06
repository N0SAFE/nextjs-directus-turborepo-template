import { os } from '@orpc/server'
import { DevToolPlugin } from '../types'

/**
 * Resolves ORPC router from an array of plugins
 * @param plugins - Array of DevTool plugins
 * @returns Combined ORPC router
 */
export function resolveOrpcContractFromPlugins(plugins: DevToolPlugin[]) {
  const pluginRouters: Record<string, any> = {}
  
  // Collect routers from plugins that have ORPC definitions
  for (const plugin of plugins) {
    if (plugin.orpc?.contract && plugin.orpc?.handlers) {
      // Create a router for this plugin using its contract and handlers
      pluginRouters[plugin.metadata.id] = os.router(plugin.orpc.handlers)
    }
  }
  
  // If no plugin routers, return empty router
  if (Object.keys(pluginRouters).length === 0) {
    return os.router({})
  }
  
  // Return combined router with plugin routers under their respective namespaces
  return os.router(pluginRouters)
}

/**
 * Resolves ORPC handlers from an array of plugins
 * @param plugins - Array of DevTool plugins
 * @returns Combined handlers object
 */
export function resolveOrpcHandlerFromPlugins(plugins: DevToolPlugin[]) {
  const pluginHandlers: Record<string, any> = {}
  
  // Collect handlers from plugins that have ORPC definitions
  for (const plugin of plugins) {
    if (plugin.orpc?.handlers) {
      // Use plugin ID as the route namespace
      pluginHandlers[plugin.metadata.id] = plugin.orpc.handlers
    }
  }
  
  return pluginHandlers
}