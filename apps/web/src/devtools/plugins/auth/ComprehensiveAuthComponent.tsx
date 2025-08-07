'use client'

import React, { useState, useEffect } from 'react'
import { 
  User, 
  Shield, 
  Clock, 
  Key, 
  Users, 
  AlertTriangle, 
  Settings,
  RefreshCw,
  Activity,
  Monitor,
  MapPin
} from 'lucide-react'
import { Button } from '@repo/ui/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/shadcn/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/shadcn/tabs'
import { Separator } from '@repo/ui/components/shadcn/separator'
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/shadcn/alert'
import { DevToolPlugin } from '../../types'
import { useDevToolAPI } from '../../hooks'

/**
 * Comprehensive Auth Component - Handles all auth-related pages
 */
export function AuthComponent({ context }: { context: any }) {
  const [authConfig, setAuthConfig] = useState<any>(null)
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [activeSessions, setActiveSessions] = useState<any[]>([])
  const [passkeyInfo, setPasskeyInfo] = useState<any>(null)
  const [securityEvents, setSecurityEvents] = useState<any[]>([])
  const [authStats, setAuthStats] = useState<any>(null)
  const [endpointTests, setEndpointTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const api = useDevToolAPI()

  const loadAuthData = async () => {
    if (!api) return
    
    try {
      setLoading(true)
      
      const [
        configResult,
        sessionResult,
        sessionsResult,
        passkeyResult,
        eventsResult,
        statsResult,
        endpointsResult
      ] = await Promise.all([
        api.auth.getAuthConfig().catch(() => null),
        api.auth.getCurrentSession().catch(() => null),
        Promise.resolve([]), // Mock active sessions
        api.auth.getPasskeys().catch(() => []),
        api.auth.getSecurityEvents().catch(() => []),
        Promise.resolve(null), // Mock auth stats
        Promise.resolve([]) // Mock test endpoints
      ])
      
      setAuthConfig(configResult)
      setSessionInfo(sessionResult)
      setActiveSessions(sessionsResult)
      setPasskeyInfo(passkeyResult)
      setSecurityEvents(eventsResult)
      setAuthStats(statsResult)
      setEndpointTests(endpointsResult)
    } catch (error) {
      console.error('Failed to load auth data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuthData()
  }, [api])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600'
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <User className="h-4 w-4" />
      case 'logout': return <Activity className="h-4 w-4" />
      case 'failed_login': return <AlertTriangle className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading authentication data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Auth Statistics Overview */}
      {authStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{authStats.activeSessions}</div>
              <p className="text-xs text-muted-foreground">{authStats.totalSessions} total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Passkeys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{authStats.registeredPasskeys}</div>
              <p className="text-xs text-muted-foreground">registered</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{authStats.successRate}%</div>
              <p className="text-xs text-muted-foreground">{authStats.recentLogins} recent logins</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Events</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{authStats.securityEvents}</div>
              {authStats.suspiciousActivity > 0 && (
                <p className="text-xs text-red-600">{authStats.suspiciousActivity} suspicious</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="session" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="sessions">All Sessions</TabsTrigger>
          <TabsTrigger value="passkeys">Passkeys</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        {/* Current Session Tab */}
        <TabsContent value="session" className="space-y-4">
          {sessionInfo ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Current Session
                </CardTitle>
                <CardDescription>Active session information and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span className="font-medium">User:</span>
                      <span>{sessionInfo.name} ({sessionInfo.email})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Created:</span>
                      <span>{formatDate(sessionInfo.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4" />
                      <span className="font-medium">Last Activity:</span>
                      <span>{formatDate(sessionInfo.lastActivity)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Status:</span>
                      <Badge variant={sessionInfo.isActive ? "default" : "destructive"}>
                        {sessionInfo.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Key className="h-4 w-4" />
                      <span className="font-medium">2FA:</span>
                      <Badge variant={sessionInfo.metadata.twoFactorEnabled ? "default" : "secondary"}>
                        {sessionInfo.metadata.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Monitor className="h-4 w-4" />
                      <span className="font-medium">Login Method:</span>
                      <span className="capitalize">{sessionInfo.metadata.loginMethod}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {sessionInfo.permissions.map((permission: string, index: number) => (
                      <Badge key={index} variant="outline">{permission}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Active Session</AlertTitle>
              <AlertDescription>
                No user is currently logged in or session information is unavailable.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* All Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>All active user sessions across devices</CardDescription>
            </CardHeader>
            <CardContent>
              {activeSessions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.userId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(session.lastActivity)}</TableCell>
                        <TableCell className="font-mono text-xs">{session.ipAddress}</TableCell>
                        <TableCell>
                          <Badge variant={session.isActive ? "default" : "secondary"}>
                            {session.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active sessions found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Passkeys Tab */}
        <TabsContent value="passkeys" className="space-y-4">
          {passkeyInfo ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Passkey Configuration
                </CardTitle>
                <CardDescription>WebAuthn passkey settings and registered keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={passkeyInfo.enabled ? "default" : "secondary"}>
                    {passkeyInfo.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                
                {passkeyInfo.registeredKeys.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Registered Keys</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Used</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {passkeyInfo.registeredKeys.map((key: any) => (
                            <TableRow key={key.id}>
                              <TableCell>{key.name}</TableCell>
                              <TableCell className="capitalize">{key.type}</TableCell>
                              <TableCell>{formatDate(key.createdAt)}</TableCell>
                              <TableCell>{formatDate(key.lastUsed)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <Key className="h-4 w-4" />
              <AlertTitle>Passkeys Not Configured</AlertTitle>
              <AlertDescription>
                Passkey authentication is not configured for this application.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Security Events Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Events
              </CardTitle>
              <CardDescription>Authentication security audit log</CardDescription>
            </CardHeader>
            <CardContent>
              {securityEvents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEventIcon(event.type)}
                            <span className="capitalize">{event.type.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(event.timestamp)}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Badge variant={event.success ? "default" : "destructive"}>
                            {event.success ? "Success" : "Failed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={event.details}>
                          {event.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No security events found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-4">
          {authConfig ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Better Auth Configuration
                </CardTitle>
                <CardDescription>Authentication system configuration and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Base URL:</span>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{authConfig.baseURL}</code>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Base Path:</span>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{authConfig.basePath}</code>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Config File:</span>
                      <Badge variant={authConfig.configExists ? "default" : "destructive"}>
                        {authConfig.configExists ? "Found" : "Missing"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-sm">Plugins:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {authConfig.plugins.map((plugin: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">{plugin}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Providers:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {authConfig.providers.map((provider: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">{provider}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {endpointTests.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Endpoint Health Check</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Endpoint</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Duration</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {endpointTests.map((test, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <code className="text-xs">{test.path}</code>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">{test.method}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge variant={test.success ? "default" : "destructive"}>
                                    {test.status}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>{test.duration}ms</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertTitle>Configuration Not Found</AlertTitle>
              <AlertDescription>
                Better Auth configuration could not be loaded.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}