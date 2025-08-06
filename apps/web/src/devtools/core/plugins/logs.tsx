'use client'

import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  AlertCircle, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Filter,
  Download,
  Trash2,
  Clock,
  CPU,
  MemoryStick,
  Server
} from 'lucide-react'
import { Button } from '@repo/ui/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Input } from '@repo/ui/components/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/shadcn/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/shadcn/table'
import { Separator } from '@repo/ui/components/shadcn/separator'
import { ScrollArea } from '@repo/ui/components/shadcn/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/shadcn/alert'
import { DevToolPlugin } from '../../types'
import { useDevToolAPI } from '../../hooks'

interface LogEntry {
  id: string
  timestamp: string
  level: string
  message: string
  source: string
  context: any
}

interface ProcessInfo {
  pid: number
  uptime: number
  memoryUsage: {
    rss: number
    heapTotal: number
    heapUsed: number
    external: number
    arrayBuffers: number
  }
  cpuUsage: {
    user: number
    system: number
  }
  platform: string
  versions: Record<string, string>
}

interface LogStats {
  totalLogs: number
  errorCount: number
  warningCount: number
  infoCount: number
  debugCount: number
  recentErrors: number
  logLevel: string
}

/**
 * Logs Component - Displays application logs and system monitoring
 */
export function LogsComponent({ context }: { context: any }) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [processInfo, setProcessInfo] = useState<ProcessInfo | null>(null)
  const [logStats, setLogStats] = useState<LogStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(false)

  const api = useDevToolAPI()

  const loadLogs = async () => {
    if (!api) return
    
    try {
      setLoading(true)
      
      // Fetch logs with current filters
      const logsInput = {
        level: selectedLevel === 'all' ? undefined : selectedLevel as any,
        limit: 100,
      }
      
      const [logsResult, processResult, statsResult] = await Promise.all([
        api.logs.getLogs(logsInput),
        api.logs.getProcessLogs(),
        api.logs.getLogStats()
      ])
      
      setLogs(logsResult)
      setProcessInfo(processResult)
      setLogStats(statsResult)
    } catch (error) {
      console.error('Failed to load logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [selectedLevel, api])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadLogs, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh, selectedLevel])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'text-red-600 bg-red-50'
      case 'warn': return 'text-yellow-600 bg-yellow-50'
      case 'info': return 'text-blue-600 bg-blue-50'
      case 'debug': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return <AlertCircle className="h-4 w-4" />
      case 'warn': return <AlertTriangle className="h-4 w-4" />
      case 'info': return <FileText className="h-4 w-4" />
      case 'debug': return <Activity className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.source.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && !logs.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading logs...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {logStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logStats.totalLogs.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{logStats.errorCount}</div>
              {logStats.recentErrors > 0 && (
                <p className="text-xs text-red-600 mt-1">{logStats.recentErrors} recent</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{logStats.warningCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Log Level</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{logStats.logLevel}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Process Information */}
      {processInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Process Information
            </CardTitle>
            <CardDescription>Node.js process and system information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4" />
                  <span className="font-medium">PID:</span>
                  <span>{processInfo.pid}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Uptime:</span>
                  <span>{formatUptime(processInfo.uptime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Server className="h-4 w-4" />
                  <span className="font-medium">Platform:</span>
                  <span className="capitalize">{processInfo.platform}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MemoryStick className="h-4 w-4" />
                  <span className="font-medium">RSS:</span>
                  <span>{formatBytes(processInfo.memoryUsage.rss)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MemoryStick className="h-4 w-4" />
                  <span className="font-medium">Heap Used:</span>
                  <span>{formatBytes(processInfo.memoryUsage.heapUsed)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MemoryStick className="h-4 w-4" />
                  <span className="font-medium">Heap Total:</span>
                  <span>{formatBytes(processInfo.memoryUsage.heapTotal)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CPU className="h-4 w-4" />
                  <span className="font-medium">CPU User:</span>
                  <span>{(processInfo.cpuUsage.user / 1000).toFixed(2)}ms</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CPU className="h-4 w-4" />
                  <span className="font-medium">CPU System:</span>
                  <span>{(processInfo.cpuUsage.system / 1000).toFixed(2)}ms</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Server className="h-4 w-4" />
                  <span className="font-medium">Node.js:</span>
                  <span>{processInfo.versions.node}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Logs
              </CardTitle>
              <CardDescription>View and filter application log entries</CardDescription>
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
              <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
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
            
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            
            <div className="ml-auto text-sm text-muted-foreground">
              {filteredLogs.length} of {logs.length} logs
            </div>
          </div>

          {/* Log Table */}
          <div className="border rounded-md">
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Level</TableHead>
                    <TableHead className="w-40">Timestamp</TableHead>
                    <TableHead className="w-32">Source</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant="secondary" className={getLevelColor(log.level)}>
                            <span className="flex items-center gap-1">
                              {getLevelIcon(log.level)}
                              {log.level.toUpperCase()}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {log.source}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate" title={log.message}>
                            {log.message}
                          </div>
                          {log.context && Object.keys(log.context).length > 0 && (
                            <details className="mt-1">
                              <summary className="text-xs text-muted-foreground cursor-pointer">
                                Context
                              </summary>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(log.context, null, 2)}
                              </pre>
                            </details>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* High Error Rate Alert */}
      {logStats && logStats.recentErrors > 10 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>High Error Rate Detected</AlertTitle>
          <AlertDescription>
            There have been {logStats.recentErrors} errors in recent logs. 
            Consider checking your application health.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}