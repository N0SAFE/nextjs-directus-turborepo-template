import { createORPCNext } from '@orpc/next'
import { resolveOrpcContractFromPlugins, resolveOrpcHandlerFromPlugins } from '../../../../devtools/contracts'
import { devToolPluginManager } from '../../../../devtools/core/plugin-manager'

const orpc = createORPCNext()

// Get all plugins from the plugin manager
const plugins = devToolPluginManager.getAllPlugins()

// Resolve contracts and handlers from plugins
const devtoolContract = resolveOrpcContractFromPlugins(plugins)
const devtoolHandlers = resolveOrpcHandlerFromPlugins(plugins)

export const { GET, POST } = orpc.router(devtoolContract, devtoolHandlers)