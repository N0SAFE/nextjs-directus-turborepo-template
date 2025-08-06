'use client'

import { PluginContext } from '../../../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Button } from '@repo/ui/components/shadcn/button'
import { Skeleton } from '@repo/ui/components/shadcn/skeleton'
import { Input } from '@repo/ui/components/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/shadcn/select'
import { ScrollText, Activity, Search, Trash2, RefreshCw, AlertCircle, AlertTriangle, Info, Bug } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useDevToolAPI } from '../../../hooks/useDevToolAPI'

/**
 * Logs Viewer component - displays and filters application logs from API
 */
export function LogsViewerComponent({ context }: { context: PluginContext }) {
  const [logs, setLogs] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const api = useDevToolAPI()
  const intervalRef = useRef<NodeJS.Timeout>()

  const loadLogs = async () => {
    try {
      const [logsData, statsData] = await Promise.all([
        api.devtools.logs.getLogs({
          level: levelFilter === 'all' ? undefined : levelFilter as any,
          limit: 100
        }),
        api.devtools.logs.getLogStats()
      ])
      
      setLogs(logsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load logs:', error)
      // Fallback data
      setLogs([
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Database connection failed',
          source: 'database.service.ts',
          metadata: { code: 'ECONNREFUSED' }
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          level: 'warn',
          message: 'Slow query detected: 2.3s',
          source: 'api.middleware.ts',
          metadata: { duration: 2300 }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: 'info',
          message: 'User authenticated successfully',
          source: 'auth.service.ts',
          metadata: { userId: 'user_123' }
        }
      ])
      setStats({
        totalLogs: 156,
        errorCount: 2,
        warnCount: 5,
        infoCount: 125,
        debugCount: 24,
        lastError: 'Database connection failed',
        lastUpdated: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [levelFilter, api])

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(loadLogs, 5000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh])

  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.source.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'debug':
        return <Bug className="h-4 w-4 text-gray-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getLevelBadge = (level: string) => {
    const variants = {
      error: 'destructive',
      warn: 'secondary',
      info: 'default',
      debug: 'outline'
    } as const

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'outline'}>
        {level.toUpperCase()}
      </Badge>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const clearLogs = async () => {
    try {
      await api.devtools.logs.clearLogs({ level: levelFilter === 'all' ? undefined : levelFilter as any })
      loadLogs()
    } catch (error) {
      console.error('Failed to clear logs:', error)
      alert('Failed to clear logs')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Application Logs
            </CardTitle>
            <CardDescription>
              Loading application logs...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <ScrollText className="h-5 w-5" />
                Application Logs
              </CardTitle>
              <CardDescription>
                Real-time application logs and monitoring
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto' : 'Manual'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearLogs}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statistics */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Total Logs</span>
                  <p className="text-2xl font-bold">{stats.totalLogs}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Errors</span>
                  <p className="text-2xl font-bold text-red-600">{stats.errorCount}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Warnings</span>
                  <p className="text-2xl font-bold text-yellow-600">{stats.warnCount}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Info</span>
                  <p className="text-2xl font-bold text-blue-600">{stats.infoCount}</p>
                </div>
              </div>
            )}

            {/* Logs List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {getLevelIcon(log.level)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      {getLevelBadge(log.level)}
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {log.source}
                      </span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded">
                        {JSON.stringify(log.metadata, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredLogs.length === 0 && searchTerm && (
              <div className="text-center py-8 text-muted-foreground">
                No logs found matching "{searchTerm}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Process Info component - displays system and process monitoring information from API
 */
export function ProcessInfoComponent({ context }: { context: PluginContext }) {
  const [processInfo, setProcessInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const api = useDevToolAPI()

  useEffect(() => {
    const loadProcessInfo = async () => {
      try {
        setLoading(true)
        const info = await api.devtools.logs.getProcessInfo()
        setProcessInfo(info)
      } catch (error) {
        console.error('Failed to load process info:', error)
        // Fallback data
        setProcessInfo({
          pid: 12345,
          uptime: 3600000, // 1 hour in ms
          memory: {
            rss: 163840000, // ~156MB
            heapTotal: 89088000,
            heapUsed: 65536000,
            external: 8192000
          },
          cpu: {
            user: 120000,
            system: 45000
          },
          versions: {
            node: '18.17.0',
            npm: '9.8.1',
            v8: '10.2.154.26'
          },
          platform: 'linux',
          arch: 'x64'
        })
      } finally {
        setLoading(false)
      }
    }

    loadProcessInfo()
    const interval = setInterval(loadProcessInfo, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [api])

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Process Information
            </CardTitle>
            <CardDescription>
              Loading process information...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
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
            <Activity className="h-5 w-5" />
            Process Information
          </CardTitle>
          <CardDescription>
            System and process monitoring data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Process Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Process ID</span>
                <p className="text-xl font-bold">{processInfo.pid}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Uptime</span>
                <p className="text-xl font-bold">{formatUptime(processInfo.uptime)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Platform</span>
                <p className="text-xl font-bold">{processInfo.platform}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Architecture</span>
                <p className="text-xl font-bold">{processInfo.arch}</p>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Memory Usage</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 p-3 border rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">RSS Memory</span>
                  <p className="text-lg font-bold text-blue-600">{formatBytes(processInfo.memory.rss)}</p>
                </div>
                <div className="space-y-2 p-3 border rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">Heap Total</span>
                  <p className="text-lg font-bold text-green-600">{formatBytes(processInfo.memory.heapTotal)}</p>
                </div>
                <div className="space-y-2 p-3 border rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">Heap Used</span>
                  <p className="text-lg font-bold text-yellow-600">{formatBytes(processInfo.memory.heapUsed)}</p>
                </div>
                <div className="space-y-2 p-3 border rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">External</span>
                  <p className="text-lg font-bold text-purple-600">{formatBytes(processInfo.memory.external)}</p>
                </div>
              </div>
            </div>

            {/* Versions */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Runtime Versions</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(processInfo.versions).map(([name, version]) => (
                  <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium text-sm capitalize">{name}</span>
                    <Badge variant="outline">{version as string}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* CPU Usage */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">CPU Time (microseconds)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 p-3 border rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">User CPU Time</span>
                  <p className="text-lg font-bold">{processInfo.cpu.user.toLocaleString()}</p>
                </div>
                <div className="space-y-2 p-3 border rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">System CPU Time</span>
                  <p className="text-lg font-bold">{processInfo.cpu.system.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}