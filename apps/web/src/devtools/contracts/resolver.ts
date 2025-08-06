import { os } from '@orpc/server'
import { DevToolPlugin } from '../types'
import { serviceRegistry, SERVICE_KEYS } from '../services/registry'

/**
 * Resolves ORPC router from an array of plugins
 * @param plugins - Array of DevTool plugins
 * @returns Combined ORPC router
 */
export function resolveOrpcContractFromPlugins(plugins: DevToolPlugin[]) {
  const pluginRouters: Record<string, any> = {}
  
  // Collect routers from plugins that have ORPC definitions
  for (const plugin of plugins) {
    if (plugin.orpc?.contract) {
      // Get handlers from either direct handlers or handler factory
      const handlers = getPluginHandlers(plugin)
      if (handlers) {
        // Create a router for this plugin using its contract and handlers
        pluginRouters[plugin.metadata.id] = os.router(handlers)
      }
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
    if (plugin.orpc) {
      const handlers = getPluginHandlers(plugin)
      if (handlers) {
        // Use plugin ID as the route namespace
        pluginHandlers[plugin.metadata.id] = handlers
      }
    }
  }
  
  return pluginHandlers
}

/**
 * Get handlers for a plugin, using dependency injection if needed
 * @param plugin - DevTool plugin
 * @returns Plugin handlers object
 */
function getPluginHandlers(plugin: DevToolPlugin): any {
  if (!plugin.orpc) {
    return null
  }

  // If plugin has direct handlers, use them (for client-safe plugins)
  if (plugin.orpc.handlers) {
    return plugin.orpc.handlers
  }

  // If plugin has a handler factory, use dependency injection
  if (plugin.orpc.handlerFactory) {
    // Get all registered services for injection
    const services: Record<string, any> = {}
    
    // Populate services from registry - this only works server-side
    if (typeof window === 'undefined') {
      // Get services from the registry
      for (const key of Object.values(SERVICE_KEYS)) {
        const service = serviceRegistry.get(key)
        if (service) {
          services[key] = service
        }
      }
    }
    
    return plugin.orpc.handlerFactory(services)
  }

  return null
}