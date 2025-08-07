'use client'

import { User, Shield, Clock } from 'lucide-react'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { useSession } from '@/lib/auth'
import { PluginContext } from '../../types'

/**
 * User info component for auth plugin
 */
export function UserInfoComponent({ context }: { context: PluginContext }) {
  const { data: session, isPending, error } = useSession()

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 text-xs text-destructive bg-destructive/10 rounded">
        Error: {error?.message || 'Failed to load session'}
      </div>
    )
  }

  if (!session) {
    return (
      <div className="space-y-2">
        <Badge variant="secondary">Not Authenticated</Badge>
        <p className="text-xs text-muted-foreground">User is not currently signed in</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
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
    </div>
  )
}

/**
 * Session details component for auth plugin
 */
export function SessionDetailsComponent({ context }: { context: PluginContext }) {
  const { data: session, isPending } = useSession()

  if (isPending || !session) {
    return (
      <div className="text-xs text-muted-foreground">No session data available</div>
    )
  }

  return (
    <div className="space-y-2 text-xs">
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
    </div>
  )
}

/**
 * Raw session data component for auth plugin
 */
export function RawSessionDataComponent({ context }: { context: PluginContext }) {
  const { data: session, isPending } = useSession()

  if (isPending || !session) {
    return (
      <div className="text-xs text-muted-foreground">No session data available</div>
    )
  }

  return (
    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-64 overflow-y-auto">
      {JSON.stringify(session, null, 2)}
    </pre>
  )
}