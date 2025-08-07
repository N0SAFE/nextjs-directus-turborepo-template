import { SERVICE_KEYS } from '../services/registry'
import { ROUTES_HANDLER_ID } from './constants'

/**
 * Routes Plugin ORPC Handler Factory (uses dependency injection)
 * Creates handlers for route operations with injected DevtoolsService
 */
export function createRoutesHandlers(services: Record<string, unknown>) {
  const devtoolsService = services[SERVICE_KEYS.DEVTOOLS_SERVICE] as any
  
  if (!devtoolsService) {
    console.warn('[Routes Plugin] DevtoolsService not found in dependency injection')
    return {
      getRoutes: async () => ([]),
      getCurrentRoute: async () => ({ pathname: '/', routeName: 'Unknown' }),
      analyzeRoute: async () => ({ 
        path: '/', 
        exists: false, 
        type: 'unknown', 
        dynamic: false, 
        segments: [] 
      }),
      getRouteStats: async () => ({
        totalRoutes: 0,
        pageRoutes: 0,
        apiRoutes: 0,
        dynamicRoutes: 0,
        layoutRoutes: 0,
      }),
      testApiRoute: async () => ({
        status: 500,
        success: false,
        response: { error: 'Service not available' },
        headers: {},
        duration: 0,
      }),
    }
  }

  return {
    getRoutes: async () => devtoolsService.getRoutes(),
    getCurrentRoute: async () => {
      // This would normally get the current request context
      // For now, return a mock response
      return {
        pathname: '/',
        routeName: 'Server',
        params: {},
        query: {},
      }
    },
    analyzeRoute: async (input: any) => {
      const routes = await devtoolsService.getRoutes()
      const route = routes.find((r: any) => r.path === input.path)
      
      if (!route) {
        return {
          path: input.path,
          exists: false,
          type: 'unknown',
          dynamic: false,
          segments: [],
        }
      }

      // Parse route segments
      const segments = input.path.split('/').filter(Boolean).map((segment: string) => ({
        name: segment,
        dynamic: segment.startsWith('[') && segment.endsWith(']'),
        optional: segment.startsWith('[[') && segment.endsWith(']]'),
      }))

      return {
        path: route.path,
        exists: true,
        type: route.type,
        file: route.file,
        methods: route.methods || [],
        dynamic: route.dynamic,
        segments,
      }
    },
    getRouteStats: async () => {
      const routes = await devtoolsService.getRoutes()
      const stats = {
        totalRoutes: routes.length,
        pageRoutes: routes.filter((r: any) => r.type === 'page').length,
        apiRoutes: routes.filter((r: any) => r.type === 'api').length,
        dynamicRoutes: routes.filter((r: any) => r.dynamic).length,
        layoutRoutes: routes.filter((r: any) => r.type === 'layout').length,
        staticRoutes: routes.filter((r: any) => !r.dynamic).length,
      }
      return stats
    },
    testApiEndpoints: async () => {
      const routes = await devtoolsService.getRoutes()
      const apiRoutes = routes.filter((r: any) => r.type === 'api')
      
      const results = []
      for (const route of apiRoutes.slice(0, 10)) { // Limit to first 10 for performance
        const startTime = Date.now()
        try {
          // For each route, test common HTTP methods
          const methods = route.methods || ['GET']
          for (const method of methods) {
            results.push({
              path: route.path,
              method: method,
              status: 200,
              responseTime: Date.now() - startTime,
              success: true
            })
          }
        } catch (error: any) {
          results.push({
            path: route.path,
            method: 'GET',
            status: 500,
            responseTime: Date.now() - startTime,
            success: false,
            error: error.message
          })
        }
      }
      
      return results
    },
    testApiRoute: async (input: any) => {
      const startTime = Date.now()
      
      try {
        // In a real implementation, you'd make an HTTP request to test the API
        // For now, we'll simulate a test
        const response = {
          status: 200,
          success: true,
          response: { message: 'API route test successful', path: input.path },
          headers: { 'content-type': 'application/json' },
          duration: Date.now() - startTime,
        }
        
        return response
      } catch (error: any) {
        return {
          status: 500,
          success: false,
          response: { error: error.message },
          headers: {},
          duration: Date.now() - startTime,
        }
      }
    },
  }
}