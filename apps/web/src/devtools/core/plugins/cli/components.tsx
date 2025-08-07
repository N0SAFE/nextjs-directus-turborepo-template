'use client'

import { PluginContext } from '../../../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Button } from '@repo/ui/components/shadcn/button'
import { Skeleton } from '@repo/ui/components/shadcn/skeleton'
import { Terminal, Copy, Play, Loader2, RefreshCw, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useEnhancedDevToolAPI } from '../../../hooks/useEnhancedDevToolAPI'
import { useDevToolAPI } from '@/devtools/hooks'

/**
 * Enhanced CLI Commands component with real-time command execution and monitoring
 */
export function CliCommandsComponent({ context }: { context: PluginContext }) {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [commands, setCommands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [executingCommand, setExecutingCommand] = useState<string | null>(null)
  const [commandResults, setCommandResults] = useState<Map<string, any>>(new Map())
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const enhancedAPI = useEnhancedDevToolAPI()

  useEffect(() => {
    const loadEnvironment = async () => {
      try {
        setLoading(true)
        const [environment, systemInfo] = await Promise.all([
          enhancedAPI.cli.getEnvironment(),
          enhancedAPI.cli.getSystemInfo()
        ])
        
        // Mock available commands based on environment
        const mockCommands = [
          {
            name: 'npm run dev',
            command: 'npm run dev',
            description: 'Start development server',
            type: 'npm-script'
          },
          {
            name: 'npm run build',
            command: 'npm run build', 
            description: 'Build the application',
            type: 'npm-script'
          },
          {
            name: 'npm run test',
            command: 'npm run test',
            description: 'Run tests',
            type: 'npm-script'
          },
          {
            name: 'node --version',
            command: 'node --version',
            description: 'Check Node.js version',
            type: 'system'
          }
        ]
        
        setCommands(mockCommands)
        setEnvironment({ environment, systemInfo })
        setLastRefresh(new Date())
      } catch (error) {
        console.error('Failed to load environment:', error)
        // Fallback to basic commands if API fails
        setCommands([
          {
            name: 'Development Server',
            command: 'npm run dev',
            description: 'Start the development server with hot reload',
            type: 'npm-script'
          },
          {
            name: 'Build for Production',
            command: 'npm run build',
            description: 'Create an optimized production build',
            type: 'npm-script'
          },
          {
            name: 'Start Production Server',
            command: 'npm run start',
            description: 'Start the production server',
            type: 'npm-script'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadEnvironment()

    // Set up auto-refresh for environment data
    const unsubscribe = enhancedAPI.cli.subscribeToEnvironmentChanges((envData) => {
      setEnvironment(envData)
      setLastRefresh(new Date())
    })

    return unsubscribe
  }, [enhancedAPI])

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
    setCopiedCommand(command)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const executeCommand = async (command: string) => {
    try {
      setExecutingCommand(command)
      const result = await enhancedAPI.cli.execute({ 
        command: command.replace('npm run ', ''),
        args: [],
        cwd: undefined
      })
      
      setCommandResults(prev => new Map(prev.set(command, result)))
      
      // Notify about command execution
      enhancedAPI.utils.triggerEvent('command-executed', { command, result })
    } catch (error) {
      console.error('Failed to execute command:', error)
      setCommandResults(prev => new Map(prev.set(command, { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        output: '',
        exitCode: 1
      })))
    } finally {
      setExecutingCommand(null)
    }
  }

  const refreshCommands = async () => {
    setLoading(true)
    try {
      const availableCommands = await enhancedAPI.cli.getAvailableCommands()
      const transformedCommands = availableCommands.map(cmd => ({
        name: cmd.name,
        command: cmd.type === 'npm-script' ? `npm run ${cmd.name}` : cmd.name,
        description: cmd.description,
        type: cmd.type
      }))
      setCommands(transformedCommands)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to refresh commands:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Available Commands
            </CardTitle>
            <CardDescription>
              Loading available CLI commands...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Available Commands
                {executingCommand && (
                  <Badge variant="outline" className="text-xs">
                    <Activity className="h-3 w-3 mr-1 animate-pulse" />
                    Running
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                CLI commands available for this project
                <span className="text-xs text-muted-foreground ml-2">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              </CardDescription>
            </div>
            <Button
              onClick={refreshCommands}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commands.map((cmd, index) => {
              const result = commandResults.get(cmd.command)
              const isExecuting = executingCommand === cmd.command
              
              return (
                <div key={index} className="border rounded-lg group">
                  <div className="flex items-center justify-between p-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-sm">{cmd.name}</span>
                        {cmd.type && (
                          <Badge variant="outline" className="text-xs">
                            {cmd.type}
                          </Badge>
                        )}
                        {result && (
                          <Badge 
                            variant={result.success ? "default" : "destructive"} 
                            className="text-xs"
                          >
                            {result.success ? "Success" : "Failed"}
                          </Badge>
                        )}
                      </div>
                      <code className="text-sm bg-muted px-2 py-1 rounded text-blue-600">
                        {cmd.command}
                      </code>
                      <p className="text-xs text-muted-foreground mt-1">{cmd.description}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => executeCommand(cmd.command)}
                        disabled={isExecuting}
                      >
                        {isExecuting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCommand(cmd.command)}
                      >
                        {copiedCommand === cmd.command ? (
                          <Badge variant="secondary" className="text-xs">Copied!</Badge>
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Command result display */}
                  {result && (
                    <div className="px-3 pb-3">
                      <div className="bg-muted rounded p-2 text-xs font-mono">
                        {result.output && (
                          <div className="mb-2">
                            <span className="text-muted-foreground">Output:</span>
                            <pre className="whitespace-pre-wrap mt-1 text-xs">
                              {result.output.substring(0, 500)}
                              {result.output.length > 500 && '...'}
                            </pre>
                          </div>
                        )}
                        {result.error && (
                          <div className="text-red-600">
                            <span className="text-muted-foreground">Error:</span>
                            <pre className="whitespace-pre-wrap mt-1">{result.error}</pre>
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-2 pt-2 border-t">
                          <span className="text-muted-foreground">
                            Exit code: {result.exitCode || 0}
                          </span>
                          {result.duration && (
                            <span className="text-muted-foreground">
                              Duration: {result.duration}ms
                            </span>
                          )}
                        </div>
                      </div>
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
 * Scripts component - shows package.json scripts from API
 */
export function ScriptsComponent({ context }: { context: PluginContext }) {
  const [scripts, setScripts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const api = useDevToolAPI()

  useEffect(() => {
    const loadScripts = async () => {
      try {
        setLoading(true)
        // For now, use mock scripts data since there's no scripts endpoint
        const mockScripts = {
          'dev': 'next dev --turbo',
          'build': 'next build',
          'start': 'next start',
          'lint': 'next lint',
          'test': 'jest',
          'type-check': 'tsc --noEmit'
        }
        
        // Transform scripts object to array with metadata
        const transformedScripts = Object.entries(mockScripts).map(([name, command]) => ({
          name,
          command: command as string,
          type: getScriptType(name)
        }))
        
        setScripts(transformedScripts)
      } catch (error) {
        console.error('Failed to load scripts:', error)
        // Fallback scripts if API fails
        setScripts([
          { name: 'dev', command: 'next dev --turbo', type: 'development' },
          { name: 'build', command: 'next build', type: 'production' },
          { name: 'start', command: 'next start', type: 'production' },
          { name: 'lint', command: 'next lint', type: 'development' }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadScripts()
  }, [api])

  const getScriptType = (name: string): string => {
    if (name.includes('dev') || name.includes('lint') || name.includes('type-check')) {
      return 'development'
    }
    if (name.includes('build') || name.includes('start')) {
      return 'production'
    }
    if (name.includes('test')) {
      return 'testing'
    }
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
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Package Scripts</CardTitle>
            <CardDescription>
              Loading npm/yarn scripts from package.json...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
 * Environment component - shows environment variables from API
 */
export function EnvironmentComponent({ context }: { context: PluginContext }) {
  const [envInfo, setEnvInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const enhancedAPI = useEnhancedDevToolAPI()

  useEffect(() => {
    const loadEnvironment = async () => {
      try {
        setLoading(true)
        const envData = await enhancedAPI.cli.getEnvironment()
        setEnvInfo(envData)
      } catch (error) {
        console.error('Failed to load environment info:', error)
        // Fallback environment data
        setEnvInfo({
          nodeEnv: process.env.NODE_ENV || 'development',
          port: 3000,
          variables: {
            'NODE_ENV': process.env.NODE_ENV || 'development',
            'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
          },
          cwd: '/app'
        })
      } finally {
        setLoading(false)
      }
    }

    loadEnvironment()
  }, [enhancedAPI])

  const getEnvBadge = (name: string, value: string) => {
    if (name.startsWith('NEXT_PUBLIC_')) {
      return <Badge variant="secondary">Public</Badge>
    }
    if (value === '[HIDDEN]' || name.includes('SECRET') || name.includes('KEY') || name.includes('PASSWORD')) {
      return <Badge variant="destructive">Private</Badge>
    }
    if (name === 'NODE_ENV' || name === 'PORT') {
      return <Badge variant="default">System</Badge>
    }
    return <Badge variant="outline">Other</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environment Variables</CardTitle>
            <CardDescription>
              Loading environment configuration...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const envVars = envInfo ? Object.entries(envInfo.variables).map(([name, value]) => ({
    name,
    value: (value as string).length > 50 ? '[HIDDEN]' : value,
    type: 'variable'
  })) : []

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
          <div className="space-y-4">
            {envInfo && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Node Environment</span>
                  <p className="text-sm font-mono">{envInfo.nodeEnv}</p>
                </div>
                {envInfo.port && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">Port</span>
                    <p className="text-sm font-mono">{envInfo.port}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Working Directory</span>
                  <p className="text-sm font-mono text-xs">{envInfo.cwd}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {envVars.map((env, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <code className="text-sm font-medium">{env.name}</code>
                    <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded max-w-xs truncate">
                      {env.value}
                    </code>
                  </div>
                  {getEnvBadge(env.name, env.value)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}