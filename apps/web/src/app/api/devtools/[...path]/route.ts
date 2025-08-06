import { os } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { devToolPluginManager } from '../../../../devtools/core/plugin-manager'
import { initializeServerServices } from '../../../../devtools/services/server-setup'
import { DevToolOrpcInjector, allOrpcRouterList } from '../../../../devtools/orpc-routers'

// Initialize server-side services for dependency injection
initializeServerServices()

// Get all plugins from the plugin manager
const plugins = devToolPluginManager.getAllPlugins()

// Inject services from plugins using the new system
const devtoolHandlers = DevToolOrpcInjector.injectServiceFromPlugins(plugins, allOrpcRouterList)

// Create the router using ORPC
const router = os.router(devtoolHandlers)

// Create the RPC handler for Next.js
const handler = new RPCHandler(router)

export async function GET(request: Request) {
  const result = await handler.handle(request)
  return result.matched ? result.response : new Response('Not Found', { status: 404 })
}

export async function POST(request: Request) {
  const result = await handler.handle(request)
  return result.matched ? result.response : new Response('Not Found', { status: 404 })
}