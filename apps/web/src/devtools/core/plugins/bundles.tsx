'use client'

import { PluginContext } from '../../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'

/**
 * Bundle Analysis component - displays bundle size and optimization info
 */
export function BundleAnalysisComponent({ context }: { context: PluginContext }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bundle Analysis</CardTitle>
          <CardDescription>
            Application bundle sizes and optimization metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Main Bundle</span>
                <span>245.2 KB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vendor Bundle</span>
                <span>892.1 KB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CSS Bundle</span>
                <span>28.4 KB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Dependencies component - shows package dependencies
 */
export function DependenciesComponent({ context }: { context: PluginContext }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dependencies</CardTitle>
          <CardDescription>
            Project dependencies and their versions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <code className="text-sm font-medium">next</code>
                <Badge variant="default">^14.2.0</Badge>
              </div>
              <Badge variant="secondary">Production</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <code className="text-sm font-medium">react</code>
                <Badge variant="default">^18.3.0</Badge>
              </div>
              <Badge variant="secondary">Production</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <code className="text-sm font-medium">typescript</code>
                <Badge variant="outline">^5.4.0</Badge>
              </div>
              <Badge variant="outline">Development</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <code className="text-sm font-medium">tailwindcss</code>
                <Badge variant="outline">^3.4.0</Badge>
              </div>
              <Badge variant="outline">Development</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Build Info component - shows build information
 */
export function BuildInfoComponent({ context }: { context: PluginContext }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Build Information</CardTitle>
          <CardDescription>
            Current build status and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Build Mode:</span>
              <Badge variant="default">Development</Badge>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bundle Tool:</span>
              <span>Turbopack</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target:</span>
              <span>ES2022</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tree Shaking:</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Code Splitting:</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}