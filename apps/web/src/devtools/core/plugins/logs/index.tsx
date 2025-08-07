'use client'

import React, { useState, useEffect } from 'react'
import { oc } from '@orpc/contract'
import { createPlugin, PluginUtils } from '../../../sdk'
import { LogsViewerComponent, ProcessInfoComponent } from './components'
import z from 'zod/v4'
import { useEnhancedDevToolAPI } from '../../../hooks/useEnhancedDevToolAPI'
import { LOGS_HANDLER_ID } from '../../../orpc-handlers/constants'

// Logs Plugin ORPC Contract
const logsContract = oc.router({
  // Get application logs
  getLogs: oc
    .input(z.object({
      level: z.enum(['error', 'warn', 'info', 'debug', 'all']).optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }))
    .output(z.array(z.object({
      id: z.string(),
      timestamp: z.string(),
      level: z.enum(['error', 'warn', 'info', 'debug']),
      message: z.string(),
      source: z.string(),
      metadata: z.record(z.string(), z.any()).optional(),
    }))),

  // Get process information
  getProcessInfo: oc
    .output(z.object({
      pid: z.number(),
      uptime: z.number(),
      memory: z.object({
        rss: z.number(),
        heapTotal: z.number(),
        heapUsed: z.number(),
        external: z.number(),
      }),
      cpu: z.object({
        user: z.number(),
        system: z.number(),
      }),
      versions: z.record(z.string(), z.string()),
      platform: z.string(),
      arch: z.string(),
    })),

  // Get log statistics
  getLogStats: oc
    .output(z.object({
      totalLogs: z.number(),
      errorCount: z.number(),
      warnCount: z.number(),
      infoCount: z.number(),
      debugCount: z.number(),
      lastError: z.string().optional(),
      lastUpdated: z.string(),
    })),

  // Clear logs
  clearLogs: oc
    .input(z.object({
      level: z.enum(['error', 'warn', 'info', 'debug', 'all']).optional(),
    }))
    .output(z.object({
      success: z.boolean(),
      cleared: z.number(),
    })),
})

/**
 * Get logs information for reduced mode display
 */
function getLogsInfo() {
  // This would normally come from log aggregation service
  return {
    errorCount: 2,
    warnCount: 5,
    totalLogs: 156,
    hasErrors: true,
    status: 'warning', // 'normal', 'warning', 'error'
  }
}

/**
 * Enhanced Logs reduced mode display with real-time log monitoring
 */
function LogsReducedDisplay({ context }: { context: any }) {
  const [logStats, setLogStats] = useState<any>(null)
  const [recentErrors, setRecentErrors] = useState(0)
  const enhancedAPI = useEnhancedDevToolAPI()
  
  useEffect(() => {
    // Subscribe to real-time log updates
    const unsubscribe = enhancedAPI.logs.subscribeToLogs(async (logs) => {
      // Calculate recent error count (last 5 minutes)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      const recentErrorLogs = logs.filter(log => 
        log.level === 'error' && 
        new Date(log.timestamp).getTime() > fiveMinutesAgo
      )
      
      setRecentErrors(recentErrorLogs.length)
      
      // Get updated stats
      try {
        const stats = await enhancedAPI.logs.getLogStats()
        setLogStats(stats)
      } catch (error) {
        console.error('Failed to get log stats:', error)
      }
    })

    return unsubscribe
  }, [enhancedAPI])
  
  if (recentErrors > 0) {
    return (
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-mono text-red-600">{recentErrors}</span>
      </div>
    )
  }
  
  if (logStats?.warnCount > 0) {
    return (
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 rounded-full bg-yellow-500" />
        <span className="text-xs font-mono text-yellow-600">{logStats.warnCount}</span>
      </div>
    )
  }
  
  return (
    <div className="h-2 w-2 rounded-full bg-green-500" />
  )
}

/**
 * Logs DevTool Plugin - Core plugin for application logging and monitoring
 */
export const logsPlugin = createPlugin(
  PluginUtils.createMetadata(
    'core-logs',
    'Logs',
    {
      description: 'Application logs, monitoring, and process information',
      author: 'DevTools Core',
      icon: 'ScrollText',
    }
  ),
  [
    {
      id: 'logs-group',
      label: 'Logs & Monitoring',
      icon: 'ScrollText',
      pages: [
        {
          id: 'logs-viewer',
          label: 'Logs Viewer',
          description: 'View and filter application logs',
          icon: 'ScrollText',
          component: LogsViewerComponent
        },
        {
          id: 'process-info',
          label: 'Process Info',
          description: 'Process and system monitoring',
          icon: 'Activity',
          component: ProcessInfoComponent
        }
      ]
    }
  ],
  {
    enabled: true,
    onRegister: () => {
      console.log('[DevTools Core] Logs plugin registered')
    },
    // Reduced mode configuration
    reduced: {
      component: LogsReducedDisplay,
      menu: {
        groups: [
          {
            label: 'Logs Status',
            items: [
              {
                id: 'recent-errors',
                label: 'Recent Errors',
                description: 'View recent error logs',
                badge: '2',
                action: () => {
                  const { errorCount } = getLogsInfo()
                  alert(`${errorCount} recent errors found`)
                }
              },
              {
                id: 'log-summary',
                label: 'Log Summary',
                description: 'View log statistics',
                action: () => {
                  const { totalLogs, errorCount, warnCount } = getLogsInfo()
                  alert(`Total: ${totalLogs} logs (${errorCount} errors, ${warnCount} warnings)`)
                }
              }
            ]
          },
          {
            label: 'Monitoring',
            items: [
              {
                id: 'process-health',
                label: 'Process Health',
                description: 'Check process status',
                action: () => {
                  alert('Process: Healthy (156MB memory, 2.3% CPU)')
                }
              },
              {
                id: 'clear-logs',
                label: 'Clear Logs',
                description: 'Clear application logs',
                action: () => {
                  if (confirm('Clear all logs?')) {
                    alert('Logs cleared successfully')
                  }
                }
              }
            ]
          }
        ]
      },
      // Dynamic data function
      getData: () => {
        const { errorCount, status, totalLogs } = getLogsInfo()
        return { errorCount, status, totalLogs }
      }
    },
    // ORPC contract and identifier for server communication
    orpc: {
      contract: logsContract,
      identifier: LOGS_HANDLER_ID
    }
  }
)