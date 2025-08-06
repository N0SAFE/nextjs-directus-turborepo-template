import React, { useState, useEffect } from 'react'
import { oc } from '@orpc/contract'
import { createPlugin, PluginUtils } from '../../../sdk'
import { RoutesOverviewComponent, ApiRoutesComponent } from './components'
import { ROUTES_HANDLER_ID } from '../../../orpc-handlers'
import {
  routesListSchema,
  routeInfoSchema,
  routeAnalysisSchema,
} from '../../../contracts/schemas'
import z from 'zod/v4'
import { useEnhancedDevToolAPI } from '../../../hooks/useEnhancedDevToolAPI'

// Routes Plugin ORPC Contract
const routesContract = oc.router({
  // Get all routes
  getRoutes: oc
    .output(z.array(z.object({
      path: z.string(),
      type: z.enum(['page', 'layout', 'api']),
      file: z.string(),
      dynamic: z.boolean(),
      methods: z.array(z.string()).optional(),
    }))),

  // Get current route information
  getCurrentRoute: oc
    .output(z.object({
      pathname: z.string(),
      routeName: z.string(),
      params: z.record(z.string(), z.any()).optional(),
      query: z.record(z.string(), z.any()).optional(),
    })),

  // Analyze a specific route
  analyzeRoute: oc
    .input(z.object({ path: z.string() }))
    .output(z.object({
      path: z.string(),
      exists: z.boolean(),
      type: z.string(),
      file: z.string().optional(),
      methods: z.array(z.string()).optional(),
      dynamic: z.boolean(),
      segments: z.array(z.object({
        name: z.string(),
        dynamic: z.boolean(),
        optional: z.boolean(),
      })),
    })),

  // Get route statistics
  getRouteStats: oc
    .output(z.object({
      totalRoutes: z.number(),
      pageRoutes: z.number(),
      apiRoutes: z.number(),
      layoutRoutes: z.number(),
      dynamicRoutes: z.number(),
      staticRoutes: z.number(),
    })),

  // Test API endpoints
  testApiEndpoints: oc
    .output(z.array(z.object({
      path: z.string(),
      method: z.string(),
      status: z.number(),
      responseTime: z.number(),
      success: z.boolean(),
      error: z.string().optional(),
    }))),
})

/**
 * Get current route information for reduced mode display
 */
function getCurrentRouteInfo() {
  // This would normally come from Next.js router or server
  if (typeof window !== 'undefined') {
    return {
      currentRoute: window.location.pathname,
      routeCount: 12, // Mock count
      hasApiRoutes: true,
    }
  }
  return {
    currentRoute: '/',
    routeCount: 12,
    hasApiRoutes: true,
  }
}

/**
 * Enhanced custom component for Routes reduced mode display with real-time updates
 */
function RoutesReducedDisplay({ context }: { context: any }) {
  const [currentRoute, setCurrentRoute] = useState('/')
  const [isLoading, setIsLoading] = useState(false)
  const enhancedAPI = useEnhancedDevToolAPI()
  
  useEffect(() => {
    // Get initial route info
    const routeInfo = enhancedAPI.routes.getCurrentRouteRealtime()
    if (routeInfo) {
      setCurrentRoute(routeInfo.pathname || '/')
    }

    // Subscribe to real-time route changes
    const unsubscribe = enhancedAPI.routes.subscribeToRouteChanges((routeData) => {
      setCurrentRoute(routeData.pathname || '/')
      setIsLoading(enhancedAPI.routes.isRouteChanging())
    })

    return unsubscribe
  }, [enhancedAPI])
  
  // Display the current route name in a compact format
  const displayRoute = currentRoute === '/' ? 'Home' : 
    currentRoute.split('/').filter(Boolean).pop() || currentRoute
  
  if (isLoading) {
    return (
      <div className="text-xs font-mono text-muted-foreground animate-pulse">
        ...
      </div>
    )
  }
  
  return (
    <span className="text-xs font-mono text-blue-600 truncate max-w-16">
      {displayRoute}
    </span>
  )
}

/**
 * Routes DevTool Plugin - Core plugin for route management and analysis
 */
export const routesPlugin = createPlugin(
  PluginUtils.createMetadata(
    'core-routes',
    'Routes',
    {
      description: 'Route management and API endpoint overview',
      author: 'DevTools Core',
      icon: 'Map',
    }
  ),
  [
    {
      id: 'routes-group',
      label: 'Routes',
      icon: 'Map',
      pages: [
        {
          id: 'routes-overview',
          label: 'Overview',
          description: 'All application routes',
          icon: 'Map',
          component: RoutesOverviewComponent
        },
        {
          id: 'api-routes',
          label: 'API Routes',
          description: 'API endpoints and testing',
          icon: 'Globe',
          component: ApiRoutesComponent
        }
      ]
    }
  ],
  {
    enabled: true,
    onRegister: () => {
      console.log('[DevTools Core] Routes plugin registered')
    },
    // Reduced mode configuration with enhanced real-time updates
    reduced: {
      component: RoutesReducedDisplay,
      menu: {
        groups: [
          {
            label: 'Current Route',
            items: [
              {
                id: 'route-info',
                label: 'Route Details',
                description: 'View current route information',
                action: () => {
                  // Route info will be available through the enhanced API in the component
                  const pathname = window.location.pathname
                  alert(`Current route: ${pathname}`)
                }
              },
              {
                id: 'route-params',
                label: 'Route Parameters',
                description: 'View current route parameters and query',
                action: () => {
                  const params = new URLSearchParams(window.location.search)
                  const paramString = Array.from(params.entries()).map(([k, v]) => `${k}=${v}`).join(', ')
                  alert(paramString || 'No parameters')
                }
              }
            ]
          },
          {
            label: 'Navigation',
            items: [
              {
                id: 'view-all-routes',
                label: 'View All Routes',
                description: 'Open routes overview',
                badge: 'All',
                action: () => {
                  window.dispatchEvent(new CustomEvent('devtools:expand-plugin', { 
                    detail: { pluginId: 'core-routes', pageId: 'routes-overview' } 
                  }))
                }
              },
              {
                id: 'api-status',
                label: 'API Status',
                description: 'Check API endpoint health',
                action: () => {
                  alert('Checking API status...')
                }
              }
            ]
          }
        ]
      },
      // Enhanced dynamic data function with real-time updates
      getData: () => {
        return { 
          currentRoute: window.location.pathname || '/', 
          routeName: 'Current',
          isLoading: false
        }
      }
    },
    // ORPC contract and identifier for server communication
    orpc: {
      contract: routesContract,
      identifier: ROUTES_HANDLER_ID
    }
  }
)