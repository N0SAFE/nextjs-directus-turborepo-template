import { createPlugin, PluginUtils } from '../../sdk'
import { Settings, RefreshCw, Database, Zap } from 'lucide-react'
import { useState } from 'react'

/**
 * Example component for dialog content
 */
function DatabaseSettingsComponent() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Host</label>
          <input className="w-full mt-1 px-2 py-1 text-xs border rounded" defaultValue="localhost" />
        </div>
        <div>
          <label className="text-xs font-medium">Port</label>
          <input className="w-full mt-1 px-2 py-1 text-xs border rounded" defaultValue="5432" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium">Database</label>
        <input className="w-full mt-1 px-2 py-1 text-xs border rounded" defaultValue="myapp" />
      </div>
    </div>
  )
}

/**
 * Example plugin demonstrating all option types
 */
export const examplePlugin = createPlugin(
  PluginUtils.createMetadata(
    'example',
    'Example Plugin',
    {
      description: 'Demonstrates all available plugin option types',
      author: 'DevTools Team',
      icon: 'Settings',
      version: '1.0.0'
    }
  ),
  [
    {
      id: 'feature-toggle',
      type: 'toggle',
      label: 'Debug Mode',
      description: 'Enable detailed debugging information',
      checked: false,
      onChange: (checked) => {
        console.log('[Example Plugin] Debug mode:', checked)
      }
    },
    {
      id: 'refresh-menu',
      type: 'menu',
      label: 'Actions',
      description: 'Quick actions for development',
      triggerText: 'Actions',
      items: [
        {
          id: 'clear-cache',
          label: 'Clear Cache',
          onClick: () => {
            console.log('[Example Plugin] Cache cleared')
          }
        },
        {
          id: 'reload-data',
          label: 'Reload Data',
          onClick: () => {
            console.log('[Example Plugin] Data reloaded')
          }
        },
        {
          id: 'force-refresh',
          label: 'Force Refresh',
          onClick: () => {
            window.location.reload()
          }
        }
      ]
    },
    {
      id: 'connection-dialog',
      type: 'dialog',
      label: 'Database Settings',
      description: 'Configure database connection',
      title: 'Database Configuration',
      triggerText: 'Configure',
      size: 'md',
      content: DatabaseSettingsComponent
    },
    {
      id: 'api-endpoint',
      type: 'input',
      label: 'API Endpoint',
      description: 'Current API base URL',
      inputType: 'text',
      value: 'https://api.example.com',
      placeholder: 'Enter API endpoint...',
      onChange: (value) => {
        console.log('[Example Plugin] API endpoint changed:', value)
      }
    },
    {
      id: 'request-timeout',
      type: 'input',
      label: 'Timeout (ms)',
      description: 'Request timeout in milliseconds',
      inputType: 'number',
      value: 5000,
      onChange: (value) => {
        console.log('[Example Plugin] Timeout changed:', value)
      }
    },
    {
      id: 'server-list',
      type: 'list',
      label: 'Available Servers',
      description: 'Select servers to monitor',
      selectable: true,
      items: [
        {
          id: 'prod',
          label: 'Production',
          value: 'prod',
          secondary: 'https://api.prod.example.com'
        },
        {
          id: 'staging',
          label: 'Staging',
          value: 'staging',
          secondary: 'https://api.staging.example.com'
        },
        {
          id: 'dev',
          label: 'Development',
          value: 'dev',
          secondary: 'https://api.dev.example.com'
        }
      ],
      onSelectionChange: (selectedIds) => {
        console.log('[Example Plugin] Selected servers:', selectedIds)
      }
    },
    {
      id: 'monitoring-tabs',
      type: 'tabs',
      label: 'System Monitoring',
      description: 'Real-time system information',
      tabs: [
        {
          id: 'performance',
          label: 'Performance',
          content: () => (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>CPU Usage:</span>
                <span className="font-mono">23%</span>
              </div>
              <div className="flex justify-between">
                <span>Memory:</span>
                <span className="font-mono">1.2GB / 8GB</span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-mono">↓ 1.2MB/s ↑ 0.3MB/s</span>
              </div>
            </div>
          )
        },
        {
          id: 'logs',
          label: 'Logs',
          content: () => (
            <div className="space-y-1 text-xs font-mono bg-black text-green-400 p-2 rounded max-h-32 overflow-y-auto">
              <div>[12:34:56] INFO: Server started</div>
              <div>[12:35:01] DEBUG: Database connected</div>
              <div>[12:35:15] INFO: User authenticated</div>
              <div>[12:35:23] WARN: Rate limit approaching</div>
            </div>
          )
        }
      ],
      defaultTab: 'performance'
    }
  ],
  {
    enabled: true,
    onRegister: () => {
      console.log('[DevTools] Example plugin registered')
    },
    onActivate: () => {
      console.log('[DevTools] Example plugin activated')
    }
  }
)