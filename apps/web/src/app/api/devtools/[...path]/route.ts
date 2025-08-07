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
  
  try {
    // Set a timeout for the request to prevent hanging
    const timeoutPromise = new Promise<Response>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 60000) // 60 second timeout
    })
    
    const handlerPromise = handler.handle(request)
    
    const result = await Promise.race([handlerPromise, timeoutPromise])
    
    if ('matched' in result) {
      return result.matched ? result.response : new Response('Not Found', { status: 404 })
    }
    
    return result
  } catch (error: any) {
    console.error('DevTool API error:', error)
    
    // Return appropriate error response
    if (error.message === 'Request timeout') {
      return new Response('Request Timeout', { status: 504 })
    }
    
    return new Response('Internal Server Error', { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Unknown error' })
    })
  }
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest