import { os } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { initializeServerServices } from '../../../../devtools/services/server-setup'
import { DevToolOrpcInjector, allOrpcRouterList } from '../../../../devtools/orpc-routers'
import { devToolPluginManager } from '../../../../devtools/core/plugin-manager'
import { devtoolsContract } from '../../../../devtools/contracts'

// Initialize server-side services for dependency injection
initializeServerServices()

// Get all plugins from the plugin manager
const plugins = devToolPluginManager.getAllPlugins()

// Inject services from plugins using the new system
const devtoolHandlers = DevToolOrpcInjector.injectServiceFromPlugins(plugins, allOrpcRouterList)

// Create the router by implementing the contract with the handlers
const router = os.router(devtoolsContract, devtoolHandlers)

// Create the RPC handler for Next.js
const handler = new RPCHandler(router)

async function handleRequest(request: Request) {
  console.debug('Handling request in DevTool ORPC route')
  const result = await handler.handle(request)
  return result.matched ? result.response : new Response('Not Found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest