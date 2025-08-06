import React from 'react'
import { oc } from '@orpc/contract'
import { FileText, AlertCircle, Activity } from 'lucide-react'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { createPlugin, PluginUtils } from '../../sdk'
import { LogsComponent } from './logs'
import z from 'zod/v4'

// Logs Plugin ORPC Contract
const logsContract = oc.router({
  // Get application logs
  getLogs: oc
    .input(z.object({
      level: z.enum(['info', 'warn', 'error', 'debug']).optional(),
      limit: z.number().optional(),
      since: z.string().optional(),
    }))
    .output(z.array(z.object({
      id: z.string(),
      timestamp: z.string(),
      level: z.string(),
      message: z.string(),
      source: z.string(),
      context: z.any(),
    }))),

  // Get process logs and information
  getProcessLogs: oc
    .output(z.object({
      pid: z.number(),
      uptime: z.number(),
      memoryUsage: z.object({
        rss: z.number(),
        heapTotal: z.number(),
        heapUsed: z.number(),
        external: z.number(),
        arrayBuffers: z.number(),
      }),
      cpuUsage: z.object({
        user: z.number(),
        system: z.number(),
      }),
      platform: z.string(),
      versions: z.record(z.string(), z.string()),
    })),

  // Get log statistics
  getLogStats: oc
    .output(z.object({
      totalLogs: z.number(),
      errorCount: z.number(),
      warningCount: z.number(),
      infoCount: z.number(),
      debugCount: z.number(),
      recentErrors: z.number(),
      logLevel: z.string(),
    })),
})

/**
 * Get logs information for reduced mode display
 */
function getLogsInfo() {
  return {
    errorCount: Math.floor(Math.random() * 5),
    warningCount: Math.floor(Math.random() * 10) + 2,
    totalLogs: Math.floor(Math.random() * 500) + 100,
    hasRecentErrors: Math.random() > 0.7,
  }
}

/**
 * Custom component for logs reduced mode display
 */
function LogsReducedDisplay({ context }: { context: any }) {
  const { errorCount, hasRecentErrors } = getLogsInfo()
  
  if (hasRecentErrors || errorCount > 0) {
    return (
      <div className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3 text-red-500" />
        <span className="text-xs text-red-600 font-mono">{errorCount}</span>
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-1">
      <Activity className="h-3 w-3 text-green-500" />
      <span className="text-xs text-green-600">OK</span>
    </div>
  )
}

/**
 * Logs DevTool Plugin - Core plugin for application logging
 */
export const logsPlugin = createPlugin(
  PluginUtils.createMetadata(
    'core-logs',
    'Logs',
    {
      description: 'Application logs and system monitoring',
      author: 'DevTools Core',
      icon: 'FileText',
    }
  ),
  [
    {
      id: 'logs-group',
      label: 'Application Logs',
      icon: 'FileText',
      pages: [
        {
          id: 'logs-overview',
          label: 'All Logs',
          description: 'View all application logs',
          icon: 'FileText',
          component: LogsComponent
        },
        {
          id: 'error-logs',
          label: 'Errors',
          description: 'View error logs and exceptions',
          icon: 'AlertCircle',
          component: LogsComponent
        },
        {
          id: 'process-info',
          label: 'Process Info',
          description: 'View process and system information',
          icon: 'Activity',
          component: LogsComponent
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
            label: 'Logs',
            items: [
              {
                id: 'view-errors',
                label: 'View Errors',
                description: 'Show recent error logs',
                action: () => {
                  const { errorCount } = getLogsInfo()
                  alert(`${errorCount} errors found in recent logs`)
                }
              },
              {
                id: 'view-warnings',
                label: 'View Warnings',
                description: 'Show recent warning logs',
                action: () => {
                  const { warningCount } = getLogsInfo()
                  alert(`${warningCount} warnings found in recent logs`)
                }
              }
            ]
          },
          {
            label: 'System',
            items: [
              {
                id: 'process-info',
                label: 'Process Info',
                description: 'View Node.js process information',
                action: () => {
                  alert(`Process PID: ${process.pid || 'unknown'}`)
                }
              },
              {
                id: 'clear-logs',
                label: 'Clear Logs',
                description: 'Clear all application logs',
                action: () => {
                  alert('Logs cleared (this is a demo)')
                }
              }
            ]
          }
        ]
      },
      // Dynamic data function
      getData: () => {
        const { errorCount, hasRecentErrors } = getLogsInfo()
        return { errorCount, hasRecentErrors }
      }
    },
    // ORPC contract and identifier for server communication
    orpc: {
      contract: logsContract,
      identifier: 'logs-handler'
    }
  }
)