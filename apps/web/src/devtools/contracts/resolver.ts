import { oc } from '@orpc/contract'
import { DevToolPlugin } from '../types'

/**
 * Resolves ORPC contracts from an array of plugins
 * @param plugins - Array of DevTool plugins
 * @returns Combined ORPC contract router
 */
export function resolveOrpcContractFromPlugins(plugins: DevToolPlugin[]) {
  const pluginContracts: Record<string, any> = {}
  
  // Collect contracts from plugins that have ORPC definitions
  for (const plugin of plugins) {
    if (plugin.orpc?.contract) {
      // Use plugin ID as the route namespace
      pluginContracts[plugin.metadata.id] = plugin.orpc.contract
    }
  }
  
  // If no plugin contracts, return empty router
  if (Object.keys(pluginContracts).length === 0) {
    return oc.router({})
  }
  
  // Return combined router with plugin contracts under their respective namespaces
  return oc.router(pluginContracts)
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