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

// Create the router using ORPC with handlers (converting them to procedures)
const routerHandlers: Record<string, any> = {}

// Convert plain handlers to ORPC procedures
for (const [pluginId, handlers] of Object.entries(devtoolHandlers)) {
  if (typeof handlers === 'object' && handlers !== null) {
    const procedures: Record<string, any> = {}
    
    // Convert each handler function to an ORPC procedure
    for (const [handlerName, handlerFn] of Object.entries(handlers as Record<string, unknown>)) {
      if (typeof handlerFn === 'function') {
        procedures[handlerName] = os.handler(handlerFn)
      }
    }
    
    routerHandlers[pluginId] = procedures
  }
}

// Create the router with properly formatted procedures
const router = os.router(routerHandlers)

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