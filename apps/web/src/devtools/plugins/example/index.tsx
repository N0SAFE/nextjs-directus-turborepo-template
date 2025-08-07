import { createPlugin, PluginUtils } from '../../sdk'

/**
 * Example component for system monitoring
 */
function PerformanceComponent() {
  return (
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
}

/**
 * Example component for logs
 */
function LogsComponent() {
  return (
    <div className="space-y-1 text-xs font-mono bg-black text-green-400 p-2 rounded max-h-32 overflow-y-auto">
      <div>[12:34:56] INFO: Server started</div>
      <div>[12:35:01] DEBUG: Database connected</div>
      <div>[12:35:15] INFO: User authenticated</div>
      <div>[12:35:23] WARN: Rate limit approaching</div>
    </div>
  )
}

/**
 * Example component for settings
 */
function SettingsComponent() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">API Endpoint</label>
          <input className="w-full mt-1 px-2 py-1 text-xs border rounded" defaultValue="https://api.example.com" />
        </div>
        <div>
          <label className="text-xs font-medium">Timeout (ms)</label>
          <input className="w-full mt-1 px-2 py-1 text-xs border rounded" defaultValue="5000" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium">Environment</label>
        <select className="w-full mt-1 px-2 py-1 text-xs border rounded">
          <option>Development</option>
          <option>Staging</option>
          <option>Production</option>
        </select>
      </div>
    </div>
  )
}

/**
 * Example plugin demonstrating hierarchical page structure
 */
export const examplePlugin = createPlugin(
  PluginUtils.createMetadata(
    'example',
    'Example Plugin',
    {
      description: 'Demonstrates hierarchical plugin structure with groups and pages',
      author: 'DevTools Team',
      icon: 'Settings',
      version: '1.0.0'
    }
  ),
  [
    {
      id: 'monitoring-group',
      label: 'System Monitoring',
      icon: 'Activity',
      collapsible: true,
      pages: [
        {
          id: 'performance',
          label: 'Performance',
          description: 'Real-time system performance metrics',
          icon: 'Cpu',
          component: PerformanceComponent,
          badge: 'Live'
        },
        {
          id: 'logs',
          label: 'Logs',
          description: 'Application logs and debug information',
          icon: 'Terminal',
          component: LogsComponent,
          children: [
            {
              id: 'error-logs',
              label: 'Error Logs',
              description: 'Filter and view error logs',
              icon: 'AlertTriangle',
              component: () => <div className="text-xs text-red-500">Error logs would go here</div>
            },
            {
              id: 'debug-logs',
              label: 'Debug Logs',
              description: 'Debug level logging output',
              icon: 'Bug',
              component: () => <div className="text-xs text-blue-500">Debug logs would go here</div>
            }
          ]
        }
      ]
    },
    {
      id: 'config-group',
      label: 'Configuration',
      icon: 'Settings',
      collapsible: true,
      defaultCollapsed: false,
      pages: [
        {
          id: 'settings',
          label: 'General Settings',
          description: 'Configure general application settings',
          icon: 'Sliders',
          component: SettingsComponent
        },
        {
          id: 'advanced',
          label: 'Advanced',
          description: 'Advanced configuration options',
          icon: 'Wrench',
          component: () => (
            <div className="text-xs text-muted-foreground">
              Advanced settings would go here
            </div>
          ),
          children: [
            {
              id: 'cache-settings',
              label: 'Cache Settings',
              description: 'Configure caching behavior',
              icon: 'Database',
              component: () => <div className="text-xs">Cache configuration interface</div>
            }
          ]
        }
      ]
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