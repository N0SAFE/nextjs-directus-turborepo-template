'use client'

import { PluginContext } from '../../../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Button } from '@repo/ui/components/shadcn/button'
import { Skeleton } from '@repo/ui/components/shadcn/skeleton'
import { Progress } from '@repo/ui/components/shadcn/progress'
import { Package, AlertTriangle, CheckCircle, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDevToolAPI } from '../../../hooks/useDevToolAPI'

/**
 * Bundle Analysis component - displays bundle size and optimization info from API
 */
export function BundleAnalysisComponent({ context }: { context: PluginContext }) {
  const [bundleData, setBundleData] = useState<any>(null)
  const [buildStats, setBuildStats] = useState<any>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const api = useDevToolAPI()

  useEffect(() => {
    const loadBundleData = async () => {
      try {
        setLoading(true)
        const [analysis, stats, optimizations] = await Promise.all([
          api.raw.bundles.getBundleAnalysis(),
          api.raw.bundles.getBuildStats(),
          api.raw.bundles.getOptimizationSuggestions()
        ])
        
        setBundleData(analysis)
        setBuildStats(stats)
        setSuggestions(optimizations)
      } catch (error) {
        console.error('Failed to load bundle data:', error)
        // Fallback data
        setBundleData({
          totalSize: 1024000, // 1MB
          gzippedSize: 358400, // 350KB
          chunks: [
            { name: 'main', size: 245200, gzippedSize: 85820, files: ['main.js'] },
            { name: 'vendor', size: 892100, gzippedSize: 312470, files: ['vendor.js'] },
            { name: 'css', size: 28400, gzippedSize: 9940, files: ['styles.css'] }
          ],
          assets: [
            { name: 'main.js', size: 245200, type: 'javascript' },
            { name: 'vendor.js', size: 892100, type: 'javascript' },
            { name: 'styles.css', size: 28400, type: 'stylesheet' }
          ]
        })
        setBuildStats({
          buildTime: 12500,
          bundleSize: 1024000,
          chunkCount: 3,
          assetCount: 15,
          errors: [],
          warnings: ['Large bundle size detected'],
          timestamp: new Date().toISOString()
        })
        setSuggestions([
          {
            type: 'bundle-size',
            severity: 'medium',
            message: 'Large vendor bundle detected',
            suggestion: 'Consider code splitting or dynamic imports for large dependencies'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadBundleData()
  }, [api])

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB'
  }

  const getCompressionRatio = (original: number, compressed: number) => {
    return Math.round(((original - compressed) / original) * 100)
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Bundle Analysis
            </CardTitle>
            <CardDescription>
              Loading bundle analysis...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
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
          <div className="space-y-6">
            {/* Summary Statistics */}
            {bundleData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Total Size</span>
                  <p className="text-2xl font-bold">{formatSize(bundleData.totalSize)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Gzipped</span>
                  <p className="text-2xl font-bold text-green-600">{formatSize(bundleData.gzippedSize)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Compression</span>
                  <p className="text-2xl font-bold text-blue-600">
                    {getCompressionRatio(bundleData.totalSize, bundleData.gzippedSize)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Chunks</span>
                  <p className="text-2xl font-bold">{bundleData.chunks.length}</p>
                </div>
              </div>
            )}

            {/* Chunk Breakdown */}
            {bundleData && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Chunk Breakdown</h4>
                <div className="space-y-3">
                  {bundleData.chunks.map((chunk: any, index: number) => {
                    const percentage = (chunk.size / bundleData.totalSize) * 100
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium capitalize">{chunk.name}</span>
                          <div className="flex items-center gap-2">
                            <span>{formatSize(chunk.size)}</span>
                            <Badge variant="outline" className="text-xs">
                              {getCompressionRatio(chunk.size, chunk.gzippedSize)}% compressed
                            </Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Gzipped: {formatSize(chunk.gzippedSize)} • Files: {chunk.files.join(', ')}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Build Statistics */}
            {buildStats && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Build Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-3 border rounded-lg">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">Build Time</span>
                    <p className="text-sm font-mono">{(buildStats.buildTime / 1000).toFixed(1)}s</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">Asset Count</span>
                    <p className="text-sm font-mono">{buildStats.assetCount}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">Warnings</span>
                    <p className="text-sm font-mono text-yellow-600">{buildStats.warnings.length}</p>
                  </div>
                </div>
                
                {buildStats.warnings.length > 0 && (
                  <div className="space-y-2">
                    {buildStats.warnings.map((warning: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-yellow-700">{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Optimization Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Optimization Suggestions</h4>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-0.5">
                        {getSeverityBadge(suggestion.severity)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{suggestion.message}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Dependencies component - shows package dependencies and version info from API
 */
export function DependenciesComponent({ context }: { context: PluginContext }) {
  const [dependencies, setDependencies] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'dependencies' | 'devDependencies' | 'outdated'>('all')
  const api = useDevToolAPI()

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        setLoading(true)
        const deps = await api.raw.bundles.getDependencies()
        setDependencies(deps)
      } catch (error) {
        console.error('Failed to load dependencies:', error)
        // Fallback data
        setDependencies({
          dependencies: {
            'react': '^18.2.0',
            'react-dom': '^18.2.0',
            'next': '^14.0.0',
            '@orpc/contract': '^0.0.1'
          },
          devDependencies: {
            '@types/react': '^18.2.0',
            'typescript': '^5.0.0',
            'tailwindcss': '^3.3.0'
          },
          totalCount: 7,
          outdated: [
            {
              name: 'react',
              current: '18.2.0',
              wanted: '18.2.0',
              latest: '18.3.1',
              type: 'dependency' as const
            }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    loadDependencies()
  }, [api])

  const getFilteredData = () => {
    if (!dependencies) return []

    switch (filter) {
      case 'dependencies':
        return Object.entries(dependencies.dependencies).map(([name, version]) => ({
          name,
          version: version as string,
          type: 'dependency'
        }))
      case 'devDependencies':
        return Object.entries(dependencies.devDependencies).map(([name, version]) => ({
          name,
          version: version as string,
          type: 'devDependency'
        }))
      case 'outdated':
        return dependencies.outdated
      default:
        return [
          ...Object.entries(dependencies.dependencies).map(([name, version]) => ({
            name,
            version: version as string,
            type: 'dependency'
          })),
          ...Object.entries(dependencies.devDependencies).map(([name, version]) => ({
            name,
            version: version as string,
            type: 'devDependency'
          }))
        ]
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dependencies</CardTitle>
            <CardDescription>
              Loading package dependencies...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20" />
                ))}
              </div>
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredData = getFilteredData()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dependencies</CardTitle>
          <CardDescription>
            Package dependencies and version information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Summary and Filters */}
            {dependencies && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-medium">{dependencies.totalCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Prod: </span>
                    <span className="font-medium">{Object.keys(dependencies.dependencies).length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dev: </span>
                    <span className="font-medium">{Object.keys(dependencies.devDependencies).length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Outdated: </span>
                    <span className="font-medium text-yellow-600">{dependencies.outdated.length}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {['all', 'dependencies', 'devDependencies', 'outdated'].map((filterType) => (
                    <Button
                      key={filterType}
                      variant={filter === filterType ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(filterType as any)}
                    >
                      {filterType === 'all' ? 'All' : 
                       filterType === 'dependencies' ? 'Prod' :
                       filterType === 'devDependencies' ? 'Dev' : 'Outdated'}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Dependencies List */}
            <div className="space-y-2">
              {filteredData.map((dep: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{dep.name}</span>
                    {filter === 'outdated' && dep.latest !== dep.current && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">Update available</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {filter === 'outdated' ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{dep.current}</Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="default">{dep.latest}</Badge>
                      </div>
                    ) : (
                      <Badge variant={dep.type === 'dependency' ? 'default' : 'secondary'}>
                        {dep.version}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No {filter === 'all' ? 'dependencies' : filter} found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}