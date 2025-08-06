import { oc } from '@orpc/contract'
import { devToolPluginManager } from '../core/plugin-manager'
import { DevToolOrpcInjector, allOrpcRouterList } from '../orpc-routers'

// Get all plugins from the plugin manager for contract generation
const plugins = devToolPluginManager.getAllPlugins()

// Generate the combined DevTools contract from all plugins
function createDevToolsContract() {
  const pluginContracts: Record<string, any> = {}
  
  // Collect contracts from plugins that have ORPC definitions
  for (const plugin of plugins) {
    if (plugin.orpc?.contract) {
      // Use plugin ID as the route namespace
      pluginContracts[plugin.metadata.id] = plugin.orpc.contract
    }
  }
  
  // Return combined contract with plugin contracts under their respective namespaces
  return oc.router(pluginContracts)
}

// DevTools contract for server communication within the web app
export const devtoolsContract = createDevToolsContract()

export type DevtoolsContract = typeof devtoolsContract