import { createPlugin, PluginUtils } from '../../sdk'
import { CliCommandsComponent, ScriptsComponent, EnvironmentComponent } from './cli'

/**
 * Get CLI information for reduced mode display
 */
function getCliInfo() {
  const isProduction = process.env.NODE_ENV === 'production'
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  return {
    environment: isProduction ? 'PROD' : isDevelopment ? 'DEV' : 'LOCAL',
    scriptsCount: 8, // Mock number of available scripts
    status: isProduction ? 'production' : 'development'
  }
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text: string) {
  if (typeof window !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied to clipboard: ${text}`)
    }).catch(() => {
      alert(`Failed to copy: ${text}`)
    })
  } else {
    alert(`Command: ${text}`)
  }
}

/**
 * CLI DevTool Plugin - Core plugin for CLI tools and environment
 */
export const cliPlugin = createPlugin(
  PluginUtils.createMetadata(
    'core-cli',
    'CLI',
    {
      description: 'CLI commands, scripts, and environment information',
      author: 'DevTools Core',
      icon: 'Terminal',
    }
  ),
  [
    {
      id: 'cli-group',
      label: 'CLI Tools',
      icon: 'Terminal',
      pages: [
        {
          id: 'cli-commands',
          label: 'Commands',
          description: 'Available CLI commands',
          icon: 'Terminal',
          component: CliCommandsComponent
        },
        {
          id: 'scripts',
          label: 'Scripts',
          description: 'Package.json scripts',
          icon: 'Code',
          component: ScriptsComponent
        },
        {
          id: 'environment',
          label: 'Environment',
          description: 'Environment variables and configuration',
          icon: 'Settings',
          component: EnvironmentComponent
        }
      ]
    }
  ],
  {
    enabled: true,
    onRegister: () => {
      console.log('[DevTools Core] CLI plugin registered')
    },
    // Reduced mode configuration
    reducedMode: {
      displayType: 'indicator',
      indicator: {
        color: 'blue',
        animate: false
      },
      menu: {
        groups: [
          {
            label: 'Quick Commands',
            items: [
              {
                id: 'dev-command',
                label: 'Start Development',
                description: 'npm run dev',
                action: () => copyToClipboard('npm run dev')
              },
              {
                id: 'build-command',
                label: 'Build Project',
                description: 'npm run build',
                action: () => copyToClipboard('npm run build')
              },
              {
                id: 'test-command',
                label: 'Run Tests',
                description: 'npm run test',
                action: () => copyToClipboard('npm run test')
              }
            ]
          },
          {
            label: 'Environment',
            items: [
              {
                id: 'env-info',
                label: 'Environment Info',
                description: 'View current environment',
                action: () => {
                  const { environment } = getCliInfo()
                  alert(`Current environment: ${environment}`)
                }
              },
              {
                id: 'view-scripts',
                label: 'View All Scripts',
                description: 'Open scripts overview',
                action: () => {
                  console.log('Opening scripts overview')
                }
              }
            ]
          }
        ]
      },
      // Dynamic data function
      getDisplayData: () => {
        const { status } = getCliInfo()
        return {
          indicator: {
            color: status === 'production' ? 'red' as const : 'green' as const,
            animate: status === 'development'
          }
        }
      }
    }
  }
)