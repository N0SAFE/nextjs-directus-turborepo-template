import React from 'react'
import { oc } from '@orpc/contract'
import { cn } from '@repo/ui/lib/utils'
import { createPlugin, PluginUtils } from '../../sdk'
import { CliCommandsComponent, ScriptsComponent, EnvironmentComponent } from './cli'
import { CLI_HANDLER_ID } from '../../orpc-handlers'
import {
  cliCommandSchema,
  cliCommandResultSchema,
} from '../../contracts/schemas'
import z from 'zod/v4'

// CLI Plugin ORPC Contract
const cliContract = oc.router({
  // Execute a CLI command
  execute: oc
    .input(cliCommandSchema)
    .output(cliCommandResultSchema),

  // Execute a CLI command with streaming output
  executeStream: oc
    .input(cliCommandSchema)
    .output(cliCommandResultSchema),

  // Get available npm scripts
  getScripts: oc
    .output(z.record(z.string(), z.string())),

  // Execute an npm script
  runScript: oc
    .input(z.object({
      script: z.string(),
      args: z.array(z.string()).optional(),
    }))
    .output(cliCommandResultSchema),

  // Get available commands (npm scripts + common CLI commands)
  getAvailableCommands: oc
    .output(z.array(z.object({
      name: z.string(),
      description: z.string(),
      type: z.enum(['npm-script', 'system', 'git']),
    }))),

  // Get system information
  getSystemInfo: oc
    .output(z.object({
      platform: z.string(),
      arch: z.string(),
      nodeVersion: z.string(),
      npmVersion: z.string().optional(),
      hostname: z.string(),
      uptime: z.number(),
      memory: z.object({
        total: z.number(),
        free: z.number(),
        used: z.number(),
      }),
      cpu: z.object({
        cores: z.number(),
        model: z.string(),
      }),
      loadAverage: z.array(z.number()),
    })),

  // Get environment information
  getEnvironmentInfo: oc
    .output(z.object({
      nodeEnv: z.string(),
      port: z.number().optional(),
      variables: z.record(z.string(), z.string()),
      paths: z.array(z.string()),
      cwd: z.string(),
    })),
})

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
    // ORPC contract and identifier for server communication
    orpc: {
      contract: cliContract,
      identifier: CLI_HANDLER_ID
    }
  }
)