'use client'

import { User, Shield, Clock, Key } from 'lucide-react'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Separator } from '@repo/ui/components/shadcn/separator'
import { useSession } from '@/lib/auth'
import { PluginContext } from '../../types'

/**
 * Authentication plugin component
 */
export function AuthPlugin({ context }: { context: PluginContext }) {
  const { data: session, isPending, error } = useSession()

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">Loading session...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <Card className="border-destructive/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-destructive flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Authentication Error
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">
              {error?.message || 'Failed to load session'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="space-y-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Not Authenticated</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              User is not currently signed in
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* User Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="h-4 w-4" />
            Current User
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              Authenticated
            </Badge>
          </div>
          
          <div className="space-y-2 text-xs">
            {session.user.id && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono">{session.user.id}</span>
              </div>
            )}
            
            {session.user.email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{session.user.email}</span>
              </div>
            )}
            
            {session.user.name && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span>{session.user.name}</span>
              </div>
            )}

            {session.user.image && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avatar:</span>
                <img 
                  src={session.user.image} 
                  alt="User avatar" 
                  className="w-6 h-6 rounded-full"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2 text-xs">
          {session.session.id && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session ID:</span>
              <span className="font-mono text-xs">{session.session.id.slice(0, 8)}...</span>
            </div>
          )}
          
          {session.session.expiresAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expires:</span>
              <span>{new Date(session.session.expiresAt).toLocaleString()}</span>
            </div>
          )}
          
          {session.session.createdAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{new Date(session.session.createdAt).toLocaleString()}</span>
            </div>
          )}

          {session.session.updatedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Updated:</span>
              <span>{new Date(session.session.updatedAt).toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Session Data */}
      {session && Object.keys(session).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Key className="h-4 w-4" />
              Raw Session Data
            </CardTitle>
            <CardDescription className="text-xs">
              Debug information for the current session
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}