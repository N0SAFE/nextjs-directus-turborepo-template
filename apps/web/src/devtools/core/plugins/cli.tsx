'use client'

import React, { useState } from 'react'
import { PluginContext } from '../../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Button } from '@repo/ui/components/shadcn/button'
import { Terminal, Copy, Play, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { devToolsApi } from '../../api'

/**
 * CLI Commands component - displays available commands with execution capability
 */
export function CliCommandsComponent({ context }: { context: PluginContext }) {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [executingCommand, setExecutingCommand] = useState<string | null>(null)
  const [commandResults, setCommandResults] = useState<Record<string, any>>({})

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
    setCopiedCommand(command)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const executeCommand = async (command: string) => {
    setExecutingCommand(command)
    try {
      const result = await devToolsApi.cli.execute.mutate({
        command: command.split(' ')[0],
        args: command.split(' ').slice(1),
      })
      setCommandResults(prev => ({ ...prev, [command]: result }))
    } catch (error) {
      setCommandResults(prev => ({ 
        ...prev, 
        [command]: { 
          success: false, 
          stderr: error instanceof Error ? error.message : 'Unknown error',
          stdout: '',
          exitCode: 1,
          duration: 0,
          command 
        } 
      }))
    } finally {
      setExecutingCommand(null)
    }
  }

  const commands = [
    {
      name: 'Development Server',
      command: 'npm run dev',
      description: 'Start the development server with hot reload',
      canExecute: false // Long-running command
    },
    {
      name: 'Build for Production',
      command: 'npm run build',
      description: 'Create an optimized production build',
      canExecute: true
    },
    {
      name: 'Run Tests',
      command: 'npm run test',
      description: 'Execute the test suite',
      canExecute: true
    },
    {
      name: 'Lint Code',
      command: 'npm run lint',
      description: 'Check code for linting errors',
      canExecute: true
    },
    {
      name: 'Type Check',
      command: 'npm run type-check',
      description: 'Run TypeScript type checking',
      canExecute: true
    },
    {
      name: 'Check Node Version',
      command: 'node --version',
      description: 'Display the current Node.js version',
      canExecute: true
    }
  ]

  const getResultIcon = (command: string) => {
    const result = commandResults[command]
    if (!result) return null
    
    return result.success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

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
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-sm">{cmd.name}</span>
                      {getResultIcon(cmd.command)}
                    </div>
                    <code className="text-sm bg-muted px-2 py-1 rounded text-blue-600">
                      {cmd.command}
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">{cmd.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cmd.canExecute && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand(cmd.command)}
                        disabled={executingCommand === cmd.command}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {executingCommand === cmd.command ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    )}
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
                </div>
                
                {/* Show command result */}
                {commandResults[cmd.command] && (
                  <div className="ml-3 p-3 bg-muted/50 rounded-lg border-l-2 border-l-blue-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">
                        {commandResults[cmd.command].success ? 'Success' : 'Error'} 
                        ({commandResults[cmd.command].duration}ms)
                      </span>
                      <Badge variant={commandResults[cmd.command].success ? 'default' : 'destructive'}>
                        Exit {commandResults[cmd.command].exitCode}
                      </Badge>
                    </div>
                    {commandResults[cmd.command].stdout && (
                      <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                        {commandResults[cmd.command].stdout}
                      </pre>
                    )}
                    {commandResults[cmd.command].stderr && (
                      <pre className="text-xs bg-destructive/10 text-destructive p-2 rounded border overflow-x-auto mt-2">
                        {commandResults[cmd.command].stderr}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Scripts component - shows package.json scripts with server data
 */
export function ScriptsComponent({ context }: { context: PluginContext }) {
  const [scripts, setScripts] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [executingScript, setExecutingScript] = useState<string | null>(null)
  const [scriptResults, setScriptResults] = useState<Record<string, any>>({})

  // Load scripts from server
  React.useEffect(() => {
    const loadScripts = async () => {
      try {
        const result = await devToolsApi.cli.getScripts.query()
        setScripts(result)
      } catch (error) {
        console.error('Failed to load scripts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadScripts()
  }, [])

  const executeScript = async (scriptName: string) => {
    setExecutingScript(scriptName)
    try {
      const result = await devToolsApi.cli.runScript.mutate({ script: scriptName })
      setScriptResults(prev => ({ ...prev, [scriptName]: result }))
    } catch (error) {
      setScriptResults(prev => ({ 
        ...prev, 
        [scriptName]: { 
          success: false, 
          stderr: error instanceof Error ? error.message : 'Unknown error',
          stdout: '',
          exitCode: 1,
          duration: 0,
          command: `npm run ${scriptName}` 
        } 
      }))
    } finally {
      setExecutingScript(null)
    }
  }

  const getScriptType = (name: string, command: string) => {
    if (name.includes('dev') || command.includes('dev')) return 'development'
    if (name.includes('build') || command.includes('build')) return 'production'
    if (name.includes('test') || command.includes('test')) return 'testing'
    if (name.includes('lint') || command.includes('lint')) return 'development'
    return 'other'
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading scripts...</span>
      </div>
    )
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
            {Object.entries(scripts).map(([name, command]) => {
              const type = getScriptType(name, command)
              const canExecute = !command.includes('dev') && !command.includes('start')
              
              return (
                <div key={name} className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg group">
                    <div className="flex items-center gap-3 flex-1">
                      <code className="text-sm font-medium">{name}</code>
                      <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded max-w-xs truncate">
                        {command}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      {getScriptBadge(type)}
                      {canExecute && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => executeScript(name)}
                          disabled={executingScript === name}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {executingScript === name ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Show script result */}
                  {scriptResults[name] && (
                    <div className="ml-3 p-3 bg-muted/50 rounded-lg border-l-2 border-l-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">
                          {scriptResults[name].success ? 'Success' : 'Error'} 
                          ({scriptResults[name].duration}ms)
                        </span>
                        <Badge variant={scriptResults[name].success ? 'default' : 'destructive'}>
                          Exit {scriptResults[name].exitCode}
                        </Badge>
                      </div>
                      {scriptResults[name].stdout && (
                        <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                          {scriptResults[name].stdout}
                        </pre>
                      )}
                      {scriptResults[name].stderr && (
                        <pre className="text-xs bg-destructive/10 text-destructive p-2 rounded border overflow-x-auto mt-2">
                          {scriptResults[name].stderr}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Environment component - shows environment variables from server
 */
export function EnvironmentComponent({ context }: { context: PluginContext }) {
  const [envInfo, setEnvInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Load environment info from server
  React.useEffect(() => {
    const loadEnvironment = async () => {
      try {
        const result = await devToolsApi.system.environment.query()
        setEnvInfo(result)
      } catch (error) {
        console.error('Failed to load environment:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEnvironment()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading environment...</span>
      </div>
    )
  }

  if (!envInfo) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-sm text-muted-foreground">Failed to load environment information</span>
      </div>
    )
  }

  const getEnvType = (key: string, value: string) => {
    if (key.includes('SECRET') || key.includes('PASSWORD') || key.includes('TOKEN')) return 'private'
    if (key.startsWith('NEXT_PUBLIC_')) return 'public'
    if (key === 'NODE_ENV' || key === 'PATH' || key === 'PWD') return 'system'
    return 'other'
  }

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
          <CardTitle className="text-lg">Environment Information</CardTitle>
          <CardDescription>
            Current environment configuration (sensitive values shown safely)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
              <div>
                <span className="text-xs text-muted-foreground">Environment</span>
                <p className="font-medium">{envInfo.nodeEnv}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Process ID</span>
                <p className="font-medium">{envInfo.processId}</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-muted-foreground">Working Directory</span>
                <p className="font-mono text-sm">{envInfo.workingDirectory}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Environment Variables</h4>
            {Object.entries(envInfo.variables).map(([key, value]) => {
              const type = getEnvType(key, value as string)
              
              return (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <code className="text-sm font-medium">{key}</code>
                    <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded max-w-xs truncate">
                      {type === 'private' ? '[HIDDEN]' : value}
                    </code>
                  </div>
                  {getEnvBadge(type)}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}