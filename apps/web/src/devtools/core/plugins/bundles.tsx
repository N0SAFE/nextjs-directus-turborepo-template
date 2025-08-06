'use client'

import React, { useState, useEffect } from 'react'
import { PluginContext } from '../../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Progress } from '@repo/ui/components/shadcn/progress'
import { Loader2, Package, FileText, Settings, TrendingUp, TrendingDown } from 'lucide-react'
import { devToolsApi } from '../../api'

/**
 * Bundle Analysis component - displays bundle size and optimization info with server data
 */
export function BundleAnalysisComponent({ context }: { context: PluginContext }) {
  const [buildInfo, setBuildInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBuildInfo = async () => {
      try {
        const result = await devToolsApi.project.buildInfo.query()
        setBuildInfo(result)
      } catch (error) {
        console.error('Failed to load build info:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBuildInfo()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Analyzing bundles...</span>
      </div>
    )
  }

  // Mock data if no build info available
  const bundleData = buildInfo?.bundleSize || {
    total: 1245000, // 1.2MB
    gzipped: 324000, // 324KB
    chunks: [
      { name: 'main', size: 245000, gzipped: 89000 },
      { name: 'vendor', size: 892000, gzipped: 198000 },
      { name: 'runtime', size: 45000, gzipped: 12000 },
      { name: 'styles', size: 63000, gzipped: 25000 },
    ]
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getBundleColor = (size: number) => {
    if (size > 1000000) return 'bg-red-500' // > 1MB
    if (size > 500000) return 'bg-yellow-500' // > 500KB
    return 'bg-green-500' // <= 500KB
  }

  const maxChunkSize = Math.max(...bundleData.chunks.map((c: any) => c.size))

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{formatBytes(bundleData.total)}</div>
            <div className="text-xs text-muted-foreground">Total Bundle Size</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatBytes(bundleData.gzipped)}</div>
            <div className="text-xs text-muted-foreground">Gzipped Size</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Bundle Analysis
          </CardTitle>
          <CardDescription>
            Application bundle sizes and optimization metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bundleData.chunks.map((chunk: any, index: number) => {
              const percentage = (chunk.size / maxChunkSize) * 100
              const compressionRatio = ((1 - chunk.gzipped / chunk.size) * 100).toFixed(1)
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{chunk.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {compressionRatio}% compressed
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {formatBytes(chunk.gzipped)}
                      </span>
                      <span className="font-medium">
                        {formatBytes(chunk.size)}
                      </span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Optimization Tips
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Consider code splitting for vendor bundle (>{formatBytes(500000)})</li>
              <li>• Enable tree shaking to reduce unused code</li>
              <li>• Use dynamic imports for route-based splitting</li>
              <li>• Compress assets with Brotli for better compression</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Dependencies component - shows package dependencies with server data
 */
export function DependenciesComponent({ context }: { context: PluginContext }) {
  const [packageInfo, setPackageInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPackageInfo = async () => {
      try {
        const result = await devToolsApi.project.packageInfo.query({})
        setPackageInfo(result)
      } catch (error) {
        console.error('Failed to load package info:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPackageInfo()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading dependencies...</span>
      </div>
    )
  }

  if (!packageInfo) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-sm text-muted-foreground">Failed to load package information</span>
      </div>
    )
  }

  const allDeps = {
    ...packageInfo.dependencies,
    ...(packageInfo.devDependencies || {})
  }

  const getDepType = (name: string) => {
    if (packageInfo.dependencies[name]) return 'production'
    return 'development'
  }

  const getDepBadge = (type: string) => {
    return type === 'production' 
      ? <Badge variant="default">Production</Badge>
      : <Badge variant="outline">Development</Badge>
  }

  const getVersionColor = (version: string) => {
    if (version.startsWith('^') || version.startsWith('~')) return 'text-blue-600'
    if (version.includes('alpha') || version.includes('beta')) return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(packageInfo.dependencies || {}).length}
            </div>
            <div className="text-xs text-muted-foreground">Production Dependencies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(packageInfo.devDependencies || {}).length}
            </div>
            <div className="text-xs text-muted-foreground">Dev Dependencies</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dependencies
          </CardTitle>
          <CardDescription>
            Project dependencies and their versions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(allDeps).map(([name, version]) => {
              const type = getDepType(name)
              
              return (
                <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <code className="text-sm font-medium truncate">{name}</code>
                    <Badge variant="outline" className={`text-xs ${getVersionColor(version as string)}`}>
                      {version}
                    </Badge>
                  </div>
                  {getDepBadge(type)}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Build Info component - shows build information with server data
 */
export function BuildInfoComponent({ context }: { context: PluginContext }) {
  const [buildInfo, setBuildInfo] = useState<any>(null)
  const [systemInfo, setSystemInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const [buildResult, systemResult] = await Promise.all([
          devToolsApi.project.buildInfo.query(),
          devToolsApi.system.info.query()
        ])
        setBuildInfo(buildResult)
        setSystemInfo(systemResult)
      } catch (error) {
        console.error('Failed to load build info:', error)
      } finally {
        setLoading(false)
      }
    }
    loadInfo()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading build information...</span>
      </div>
    )
  }

  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Build Information
          </CardTitle>
          <CardDescription>
            Current build status and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Build Mode:</span>
              <Badge variant={isProduction ? "default" : "secondary"}>
                {isProduction ? 'Production' : 'Development'}
              </Badge>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bundle Tool:</span>
              <span>{isProduction ? 'Webpack' : 'Turbopack'}</span>
            </div>
            
            {systemInfo && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Node Version:</span>
                  <span>{systemInfo.nodeVersion}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform:</span>
                  <span>{systemInfo.platform} ({systemInfo.arch})</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CPU Cores:</span>
                  <span>{systemInfo.cpu.cores}</span>
                </div>
              </>
            )}
            
            {buildInfo?.buildTime && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Build:</span>
                <span>{new Date(buildInfo.buildTime).toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tree Shaking:</span>
              <Badge variant="secondary">
                {isProduction ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Code Splitting:</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Source Maps:</span>
              <Badge variant={isProduction ? "destructive" : "secondary"}>
                {isProduction ? 'Disabled' : 'Enabled'}
              </Badge>
            </div>
          </div>

          {buildInfo?.bundleSize && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Bundle Summary</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Total Size: {((buildInfo.bundleSize.total || 0) / 1024 / 1024).toFixed(1)} MB</div>
                <div>Gzipped: {((buildInfo.bundleSize.gzipped || 0) / 1024 / 1024).toFixed(1)} MB</div>
                <div>Chunks: {buildInfo.bundleSize.chunks?.length || 0}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}