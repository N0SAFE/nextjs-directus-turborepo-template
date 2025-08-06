'use client'

import React, { useState, useEffect } from 'react'
import { PluginContext } from '../../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Loader2, Route, Globe, Lock, ExternalLink } from 'lucide-react'
import { devToolsApi } from '../../api'

/**
 * Routes overview component - displays application routing information
 */
export function RoutesOverviewComponent({ context }: { context: PluginContext }) {
  const [routesAnalysis, setRoutesAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const result = await devToolsApi.project.routes.query()
        setRoutesAnalysis(result)
      } catch (error) {
        console.error('Failed to load routes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadRoutes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Analyzing routes...</span>
      </div>
    )
  }

  if (!routesAnalysis) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-sm text-muted-foreground">Failed to load routes analysis</span>
      </div>
    )
  }

  const getRouteType = (path: string) => {
    if (path.includes('/api/')) return 'api'
    if (path.includes('[') && path.includes(']')) return 'dynamic'
    if (path === '/') return 'root'
    return 'static'
  }

  const getRouteIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Globe className="h-4 w-4" />
      case 'dynamic':
        return <Route className="h-4 w-4" />
      case 'root':
        return <ExternalLink className="h-4 w-4" />
      default:
        return <Route className="h-4 w-4" />
    }
  }

  const getRouteBadge = (type: string, isProtected?: boolean) => {
    if (isProtected) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <Lock className="h-3 w-3" />
        Protected
      </Badge>
    }

    switch (type) {
      case 'api':
        return <Badge variant="default">API</Badge>
      case 'dynamic':
        return <Badge variant="secondary">Dynamic</Badge>
      case 'root':
        return <Badge variant="outline">Root</Badge>
      default:
        return <Badge variant="outline">Static</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{routesAnalysis.totalRoutes}</div>
            <div className="text-xs text-muted-foreground">Total Routes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{routesAnalysis.apiRoutes}</div>
            <div className="text-xs text-muted-foreground">API Routes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{routesAnalysis.pageRoutes}</div>
            <div className="text-xs text-muted-foreground">Page Routes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{routesAnalysis.protectedRoutes}</div>
            <div className="text-xs text-muted-foreground">Protected</div>
          </CardContent>
        </Card>
      </div>

      {/* Routes List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Route className="h-5 w-5" />
            Application Routes
          </CardTitle>
          <CardDescription>
            Overview of all application routes and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routesAnalysis.routes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No routes found in the application
              </div>
            ) : (
              routesAnalysis.routes.map((route: any, index: number) => {
                const type = getRouteType(route.path)
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getRouteIcon(type)}
                      <code className="text-sm font-medium">{route.path}</code>
                      {route.handler && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {route.handler}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {route.method && (
                        <Badge variant="outline" className="text-xs">
                          {route.method}
                        </Badge>
                      )}
                      {getRouteBadge(type, route.isProtected)}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * API Routes component - displays API endpoints with server data
 */
export function ApiRoutesComponent({ context }: { context: PluginContext }) {
  const [routesAnalysis, setRoutesAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const result = await devToolsApi.project.routes.query()
        setRoutesAnalysis(result)
      } catch (error) {
        console.error('Failed to load routes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadRoutes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading API routes...</span>
      </div>
    )
  }

  if (!routesAnalysis) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-sm text-muted-foreground">Failed to load API routes</span>
      </div>
    )
  }

  const apiRoutes = routesAnalysis.routes.filter((route: any) => route.path.includes('/api/'))

  const getMethodBadge = (method: string = 'GET') => {
    switch (method.toUpperCase()) {
      case 'GET':
        return <Badge variant="default">GET</Badge>
      case 'POST':
        return <Badge variant="secondary">POST</Badge>
      case 'PUT':
        return <Badge className="bg-orange-500 hover:bg-orange-600">PUT</Badge>
      case 'DELETE':
        return <Badge variant="destructive">DELETE</Badge>
      case 'PATCH':
        return <Badge className="bg-purple-500 hover:bg-purple-600">PATCH</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Endpoints
          </CardTitle>
          <CardDescription>
            List of all API endpoints and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiRoutes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No API routes found
              </div>
            ) : (
              apiRoutes.map((route: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getMethodBadge(route.method)}
                    <code className="text-sm font-medium">{route.path}</code>
                    {route.handler && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {route.handler}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {route.isProtected ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Protected
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Public</Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}