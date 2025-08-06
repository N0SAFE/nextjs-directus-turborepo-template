import React from 'react'
import { oc } from '@orpc/contract'
import { cn } from '@repo/ui/lib/utils'
import { createPlugin, PluginUtils } from '../../sdk'
import { CliCommandsComponent, ScriptsComponent, EnvironmentComponent } from './cli'
import { SERVICE_KEYS } from '../../services/registry'
import {
  cliCommandSchema,
  cliCommandResultSchema,
} from '../../contracts/schemas'

// CLI Plugin ORPC Contract
const cliContract = oc.router({
  // Execute a CLI command
  execute: oc
    .input(cliCommandSchema)
    .output(cliCommandResultSchema)
    .func(),

  // Get available npm scripts
  getScripts: oc
    .output(oc.record(oc.string()))
    .func(),

  // Execute an npm script
  runScript: oc
    .input(oc.object({
      script: oc.string(),
      args: oc.array(oc.string()).optional(),
    }))
    .output(cliCommandResultSchema)
    .func(),
})

// CLI Plugin ORPC Handler Factory (uses dependency injection)
function createCliHandlers(services: Record<string, any>) {
  const devtoolsService = services[SERVICE_KEYS.DEVTOOLS_SERVICE]
  
  if (!devtoolsService) {
    console.warn('[CLI Plugin] DevtoolsService not found in dependency injection')
    return {
      execute: async () => ({ success: false, output: '', error: 'Service not available', exitCode: 1, duration: 0 }),
      getScripts: async () => ({}),
      runScript: async () => ({ success: false, output: '', error: 'Service not available', exitCode: 1, duration: 0 }),
    }
  }

  return {
    execute: async (input: any) => devtoolsService.executeCommand(input),
    getScripts: async () => devtoolsService.getScripts(),
    runScript: async (input: any) => devtoolsService.runScript(input.script, input.args),
  }
}

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
 * Custom component for CLI reduced mode display
 */
function CliReducedDisplay({ context }: { context: any }) {
  const { status } = getCliInfo()
  
  const colorClasses = {
    production: 'bg-red-500',
    development: 'bg-green-500'
  }
  
  return (
    <div className={cn(
      'h-2 w-2 rounded-full',
      colorClasses[status as keyof typeof colorClasses] || 'bg-gray-500',
      status === 'development' && 'animate-pulse'
    )} />
  )
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
    reduced: {
      component: CliReducedDisplay,
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
      getData: () => {
        const { status, environment } = getCliInfo()
        return { status, environment }
      }
    },
    // ORPC contract and handler factory for server communication
    orpc: {
      contract: cliContract,
      handlerFactory: createCliHandlers
    }
  }
)