'use client'

import { PluginContext } from '../../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'

/**
 * Routes overview component - displays application routing information
 */
export function RoutesOverviewComponent({ context }: { context: PluginContext }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Application Routes</CardTitle>
          <CardDescription>
            Overview of all application routes and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="default">GET</Badge>
                <code className="text-sm">/</code>
              </div>
              <span className="text-sm text-muted-foreground">Home page</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">GET</Badge>
                <code className="text-sm">/api/auth/[...all]</code>
              </div>
              <span className="text-sm text-muted-foreground">Authentication routes</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline">Dynamic</Badge>
                <code className="text-sm">/dashboard/[...slug]</code>
              </div>
              <span className="text-sm text-muted-foreground">Dashboard routes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * API Routes component - displays API endpoints
 */
export function ApiRoutesComponent({ context }: { context: PluginContext }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API Endpoints</CardTitle>
          <CardDescription>
            List of all API endpoints and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="default">POST</Badge>
                <code className="text-sm">/api/auth/sign-in</code>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="default">POST</Badge>
                <code className="text-sm">/api/auth/sign-up</code>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="destructive">DELETE</Badge>
                <code className="text-sm">/api/auth/sign-out</code>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}