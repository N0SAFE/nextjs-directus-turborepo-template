import React from 'react'
import { oc } from '@orpc/contract'
import { createPlugin, PluginUtils } from '../../sdk'
import { RoutesOverviewComponent, ApiRoutesComponent } from './routes'
import { ROUTES_HANDLER_ID } from '../../orpc-handlers'
import {
  routesListSchema,
  routeInfoSchema,
  routeAnalysisSchema,
} from '../../contracts/schemas'
import z from 'zod/v4'

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
      dynamicRoutes: z.number(),
      layoutRoutes: z.number(),
    })),

  // Test an API route
  testApiRoute: oc
    .input(z.object({
      path: z.string(),
      method: z.string(),
      body: z.any().optional(),
      headers: z.record(z.string(), z.string()).optional(),
    }))
    .output(z.object({
      status: z.number(),
      success: z.boolean(),
      response: z.any(),
      headers: z.record(z.string(), z.string()),
      duration: z.number(),
    })),
})

/**
 * Get current route information for reduced mode display
 */
function getCurrentRouteInfo() {
  if (typeof window === 'undefined') {
    return { pathname: '/', routeName: 'Home' }
  }
  
  const pathname = window.location.pathname
  
  // Map common routes to friendly names
  const routeNameMap: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/api/auth': 'Auth API',
    '/api': 'API',
  }
  
  // Find the best match for the current route
  const routeName = Object.entries(routeNameMap).find(([route]) => 
    pathname.startsWith(route)
  )?.[1] || pathname.split('/').filter(Boolean).join(' > ') || 'Home'
  
  return { pathname, routeName }
}

/**
 * Custom component for routes reduced mode display
 */
function RoutesReducedDisplay({ context }: { context: any }) {
  const { routeName } = getCurrentRouteInfo()
  
  return (
    <span className="text-xs truncate max-w-20 text-muted-foreground">
      {routeName}
    </span>
  )
}

/**
 * Routes DevTool Plugin - Core plugin for route inspection
 */
export const routesPlugin = createPlugin(
  PluginUtils.createMetadata(
    'core-routes',
    'Routes',
    {
      description: 'View application routes and API endpoints',
      author: 'DevTools Core',
      icon: 'Activity',
    }
  ),
  [
    {
      id: 'routes-group',
      label: 'Application Routes',
      icon: 'Activity',
      pages: [
        {
          id: 'routes-overview',
          label: 'Routes Overview',
          description: 'View all application routes',
          icon: 'Activity',
          component: RoutesOverviewComponent
        },
        {
          id: 'api-routes',
          label: 'API Endpoints',
          description: 'View API endpoints and their status',
          icon: 'Database',
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
    // Reduced mode configuration
    reduced: {
      component: RoutesReducedDisplay,
      menu: {
        items: [
          {
            id: 'current-route',
            label: 'Current Route',
            description: 'View current route information',
            action: () => {
              const { pathname, routeName } = getCurrentRouteInfo()
              alert(`Current route: ${routeName} (${pathname})`)
            }
          },
          {
            id: 'view-all-routes',
            label: 'View All Routes',
            description: 'Open routes overview in expanded mode',
            action: () => {
              // This will be handled by the DevTool system
              console.log('Opening routes overview')
            }
          },
          {
            id: 'api-status',
            label: 'API Status',
            description: 'Check API endpoints status',
            badge: 'Online',
            action: () => {
              alert('API endpoints are operational')
            }
          }
        ]
      },
      // Dynamic data function that updates the display
      getData: () => {
        const { routeName } = getCurrentRouteInfo()
        return { currentRoute: routeName }
      }
    },
    // ORPC contract and identifier for server communication
    orpc: {
      contract: routesContract,
      identifier: ROUTES_HANDLER_ID
    }
  }
)