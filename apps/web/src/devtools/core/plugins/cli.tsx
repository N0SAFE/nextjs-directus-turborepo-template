'use client'

import { PluginContext } from '../../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Button } from '@repo/ui/components/shadcn/button'
import { Terminal, Copy, Play } from 'lucide-react'
import { useState } from 'react'

/**
 * CLI Commands component - displays available commands
 */
export function CliCommandsComponent({ context }: { context: PluginContext }) {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
    setCopiedCommand(command)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const commands = [
    {
      name: 'Development Server',
      command: 'npm run dev',
      description: 'Start the development server with hot reload'
    },
    {
      name: 'Build for Production',
      command: 'npm run build',
      description: 'Create an optimized production build'
    },
    {
      name: 'Start Production Server',
      command: 'npm run start',
      description: 'Start the production server'
    },
    {
      name: 'Run Tests',
      command: 'npm run test',
      description: 'Execute the test suite'
    },
    {
      name: 'Lint Code',
      command: 'npm run lint',
      description: 'Check code for linting errors'
    },
    {
      name: 'Type Check',
      command: 'npm run type-check',
      description: 'Run TypeScript type checking'
    }
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Available Commands
          </CardTitle>
          <CardDescription>
            Common CLI commands for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commands.map((cmd, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-sm">{cmd.name}</span>
                  </div>
                  <code className="text-sm bg-muted px-2 py-1 rounded text-blue-600">
                    {cmd.command}
                  </code>
                  <p className="text-xs text-muted-foreground mt-1">{cmd.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCommand(cmd.command)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedCommand === cmd.command ? (
                    <Badge variant="secondary" className="text-xs">Copied!</Badge>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Scripts component - shows package.json scripts
 */
export function ScriptsComponent({ context }: { context: PluginContext }) {
  const scripts = [
    { name: 'dev', command: 'next dev --turbo', type: 'development' },
    { name: 'build', command: 'next build', type: 'production' },
    { name: 'start', command: 'next start', type: 'production' },
    { name: 'lint', command: 'next lint', type: 'development' },
    { name: 'test', command: 'vitest', type: 'testing' },
    { name: 'type-check', command: 'tsc --noEmit', type: 'development' }
  ]

  const getScriptBadge = (type: string) => {
    switch (type) {
      case 'development':
        return <Badge variant="default">Development</Badge>
      case 'production':
        return <Badge variant="secondary">Production</Badge>
      case 'testing':
        return <Badge variant="outline">Testing</Badge>
      default:
        return <Badge variant="outline">Other</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Package Scripts</CardTitle>
          <CardDescription>
            Available npm/yarn scripts from package.json
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scripts.map((script, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <code className="text-sm font-medium">{script.name}</code>
                  <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                    {script.command}
                  </code>
                </div>
                {getScriptBadge(script.type)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Environment component - shows environment variables
 */
export function EnvironmentComponent({ context }: { context: PluginContext }) {
  const envVars = [
    { name: 'NODE_ENV', value: process.env.NODE_ENV || 'development', type: 'system' },
    { name: 'NEXT_PUBLIC_APP_URL', value: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', type: 'public' },
    { name: 'DATABASE_URL', value: process.env.DATABASE_URL ? '[HIDDEN]' : 'Not set', type: 'private' },
    { name: 'NEXTAUTH_SECRET', value: process.env.NEXTAUTH_SECRET ? '[HIDDEN]' : 'Not set', type: 'private' }
  ]

  const getEnvBadge = (type: string) => {
    switch (type) {
      case 'system':
        return <Badge variant="default">System</Badge>
      case 'public':
        return <Badge variant="secondary">Public</Badge>
      case 'private':
        return <Badge variant="destructive">Private</Badge>
      default:
        return <Badge variant="outline">Other</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Environment Variables</CardTitle>
          <CardDescription>
            Current environment configuration (sensitive values hidden)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {envVars.map((env, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <code className="text-sm font-medium">{env.name}</code>
                  <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded max-w-xs truncate">
                    {env.value}
                  </code>
                </div>
                {getEnvBadge(env.type)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}