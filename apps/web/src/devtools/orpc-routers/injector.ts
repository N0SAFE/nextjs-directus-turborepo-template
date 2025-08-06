import { DevToolPlugin } from '../types'
import { OrpcRouterEntry, getOrpcRouterById } from '../orpc-routers'
import { serviceRegistry } from '../services/registry'

/**
 * Injectable service that matches plugins with their ORPC routers
 * and creates the combined router for the API endpoint
 */
export class DevToolOrpcInjector {
  /**
   * Inject services from plugins using the ORPC router registry
   * @param plugins - Available plugins with ORPC contracts
   * @param _allOrpcRouterList - Registry of all available ORPC routers (for future validation)
   * @returns Combined handlers object ready for ORPC router
   */
  static injectServiceFromPlugins(
    plugins: DevToolPlugin[], 
    _allOrpcRouterList: OrpcRouterEntry[]
  ): Record<string, unknown> {
    const combinedHandlers: Record<string, unknown> = {}
    
    // Get all registered services for injection
    const services = this.getAllServices()
    
    // Process each plugin that has an ORPC contract
    for (const plugin of plugins) {
      if (!plugin.orpc?.contract || !plugin.orpc?.identifier) {
        continue
      }
      
      // Find the corresponding router entry by identifier
      const routerEntry = getOrpcRouterById(plugin.orpc.identifier)
      if (!routerEntry) {
        console.warn(`[DevTool ORPC] No router found for identifier: ${plugin.orpc.identifier} (plugin: ${plugin.metadata.id})`)
        continue
      }
      
      // Create handlers using the router's handler factory with injected services
      try {
        const handlers = routerEntry.handlerFactory(services)
        
        // Add handlers under the plugin's namespace
        combinedHandlers[plugin.metadata.id] = handlers
        
        console.log(`[DevTool ORPC] Injected router '${routerEntry.name}' for plugin '${plugin.metadata.id}'`)
      } catch (error) {
        console.error(`[DevTool ORPC] Failed to create handlers for plugin '${plugin.metadata.id}':`, error)
      }
    }
    
    return combinedHandlers
  }
  
  /**
   * Get all registered services from the service registry
   */
  private static getAllServices(): Record<string, unknown> {
    const services: Record<string, unknown> = {}
    
    // Only get services on server-side
    if (typeof window === 'undefined') {
      // Get all service keys and their values from the registry
      // Note: ServiceRegistry doesn't expose all keys, so we'll use known service keys
      const knownServiceKeys = [
        'devtools-service',
        'build-service', // Future service
        // Add more service keys as needed
      ]
      
      for (const key of knownServiceKeys) {
        const service = serviceRegistry.get(key)
        if (service) {
          services[key] = service
        }
      }
    }
    
    return services
  }
  
  /**
   * Validate that all plugins have matching routers in the registry
   * @param plugins - Plugins to validate
   * @param _allOrpcRouterList - Available router entries (for future validation)
   * @returns Validation result with any missing routers
   */
  static validatePluginRouters(
    plugins: DevToolPlugin[], 
    _allOrpcRouterList: OrpcRouterEntry[]
  ): { valid: boolean; missing: string[]; matched: string[] } {
    const missing: string[] = []
    const matched: string[] = []
    
    for (const plugin of plugins) {
      if (plugin.orpc?.identifier) {
        const routerEntry = getOrpcRouterById(plugin.orpc.identifier)
        if (routerEntry) {
          matched.push(plugin.orpc.identifier)
        } else {
          missing.push(plugin.orpc.identifier)
        }
      }
    }
    
    return {
      valid: missing.length === 0,
      missing,
      matched
    }
  }
}