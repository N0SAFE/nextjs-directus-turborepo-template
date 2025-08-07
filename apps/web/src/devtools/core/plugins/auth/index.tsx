'use client'

import React, { useState, useEffect } from 'react'
import { oc } from '@orpc/contract'
import { User, Shield, Clock, Key, Users, AlertTriangle } from 'lucide-react'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { createPlugin, PluginUtils } from '../../../sdk'
import { AuthComponent } from './components'
import z from 'zod/v4'
import { useEnhancedDevToolAPI } from '../../../hooks/useEnhancedDevToolAPI'
import { AUTH_HANDLER_ID } from '../../../orpc-handlers/constants'

// Auth Plugin ORPC Contract
const authContract = oc.router({
  // Get Better Auth configuration
  getAuthConfig: oc
    .output(z.object({
      configPath: z.string(),
      baseURL: z.string(),
      basePath: z.string(),
      plugins: z.array(z.string()),
      providers: z.array(z.string()),
      configExists: z.boolean(),
    })),

  // Get current session information
  getSessionInfo: oc
    .input(z.object({ sessionId: z.string().optional() }))
    .output(z.object({
      sessionId: z.string(),
      userId: z.string(),
      email: z.string(),
      name: z.string(),
      createdAt: z.string(),
      expiresAt: z.string(),
      lastActivity: z.string(),
      ipAddress: z.string(),
      userAgent: z.string(),
      isActive: z.boolean(),
      permissions: z.array(z.string()),
      metadata: z.object({
        loginMethod: z.string(),
        twoFactorEnabled: z.boolean(),
        passkeyRegistered: z.boolean(),
      }),
    })),

  // Get all active sessions
  getActiveSessions: oc
    .output(z.array(z.object({
      id: z.string(),
      userId: z.string(),
      createdAt: z.string(),
      lastActivity: z.string(),
      ipAddress: z.string(),
      userAgent: z.string(),
      isActive: z.boolean(),
      location: z.string(),
    }))),

  // Get passkey information
  getPasskeyInfo: oc
    .output(z.object({
      enabled: z.boolean(),
      registeredKeys: z.array(z.object({
        id: z.string(),
        name: z.string(),
        createdAt: z.string(),
        lastUsed: z.string(),
        type: z.string(),
        credentialId: z.string(),
      })),
      supportedTransports: z.array(z.string()),
      settings: z.object({
        requireUserVerification: z.boolean(),
        allowCrossPlatform: z.boolean(),
        timeout: z.number(),
      }),
    })),

  // Get security events
  getSecurityEvents: oc
    .output(z.array(z.object({
      id: z.string(),
      type: z.string(),
      timestamp: z.string(),
      ipAddress: z.string(),
      userAgent: z.string(),
      location: z.string(),
      success: z.boolean(),
      details: z.string(),
    }))),

  // Get authentication statistics
  getAuthStats: oc
    .output(z.object({
      activeSessions: z.number(),
      totalSessions: z.number(),
      registeredPasskeys: z.number(),
      recentLogins: z.number(),
      successRate: z.number(),
      securityEvents: z.number(),
      suspiciousActivity: z.number(),
      lastLogin: z.string(),
    })),

  // Test authentication endpoints
  testAuthEndpoints: oc
    .output(z.array(z.object({
      path: z.string(),
      method: z.string(),
      description: z.string(),
      success: z.boolean(),
      status: z.number(),
      duration: z.number(),
      response: z.any(),
    }))),
})

/**
 * Get authentication status for reduced mode display
 */
function getAuthStatus() {
  // This would normally come from the current session context
  return {
    isAuthenticated: true,
    userEmail: 'user@example.com',
    sessionCount: 3,
    hasPasskey: true,
    securityScore: 85,
  }
}

/**
 * Enhanced auth reduced mode display with real-time session monitoring
 */
function AuthReducedDisplay({ context }: { context: any }) {
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [securityScore, setSecurityScore] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const enhancedAPI = useEnhancedDevToolAPI()
  
  useEffect(() => {
    // Subscribe to real-time session changes
    const unsubscribe = enhancedAPI.auth.subscribeToSessionChanges(async (session) => {
      setCurrentSession(session)
      setIsAuthenticated(!!session?.isActive)
      
      // Calculate security score based on session data
      let score = 0
      if (session?.isActive) score += 40
      if (session?.metadata?.twoFactorEnabled) score += 30
      if (session?.metadata?.passkeyRegistered) score += 20
      if (session?.lastActivity && 
          Date.now() - new Date(session.lastActivity).getTime() < 30 * 60 * 1000) {
        score += 10 // Recent activity
      }
      
      setSecurityScore(score)
    })

    return unsubscribe
  }, [enhancedAPI])
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getStatusIcon = () => {
    if (!isAuthenticated) return <AlertTriangle className="h-3 w-3 text-red-600" />
    if (currentSession?.metadata?.twoFactorEnabled) return <Shield className="h-3 w-3 text-green-600" />
    return <User className="h-3 w-3 text-blue-600" />
  }
  
  return (
    <div className="flex items-center gap-1">
      {getStatusIcon()}
      <span className={`text-xs font-mono ${getScoreColor(securityScore)}`}>
        {securityScore}%
      </span>
    </div>
  )
}

/**
 * Auth DevTool Plugin - Core plugin for comprehensive authentication and security management
 */
export const authPlugin = createPlugin(
  PluginUtils.createMetadata(
    'core-auth',
    'Authentication',
    {
      description: 'User authentication and session management',
      author: 'DevTools Core',
      icon: 'Shield',
      version: '1.0.0',
    }
  ),
  [
    {
      id: 'auth-group',
      label: 'Authentication',
      icon: 'Shield',
      pages: [
        {
          id: 'session',
          label: 'Session',
          description: 'Current session information and management',
          icon: 'User',
          component: AuthComponent
        },
        {
          id: 'sessions',
          label: 'All Sessions',
          description: 'Manage all active user sessions',
          icon: 'Users',
          component: AuthComponent
        },
        {
          id: 'passkeys',
          label: 'Passkeys',
          description: 'Passkey authentication management',
          icon: 'Key',
          component: AuthComponent
        },
        {
          id: 'security',
          label: 'Security Events',
          description: 'Authentication security audit log',
          icon: 'Shield',
          component: AuthComponent
        },
        {
          id: 'config',
          label: 'Configuration',
          description: 'Better Auth configuration and setup',
          icon: 'Settings',
          component: AuthComponent
        }
      ]
    }
  ],
  {
    enabled: true,
    onRegister: () => {
      console.log('[DevTools Core] Auth plugin registered')
    },
    // Reduced mode configuration
    reduced: {
      component: AuthReducedDisplay,
      menu: {
        groups: [
          {
            label: 'Session',
            items: [
              {
                id: 'current-user',
                label: 'Current User',
                description: 'View current user information',
                action: () => {
                  const { userEmail } = getAuthStatus()
                  alert(`Logged in as: ${userEmail}`)
                }
              },
              {
                id: 'session-info',
                label: 'Session Details',
                description: 'View current session details',
                action: () => {
                  alert('Session expires in 6 days, 23 hours')
                }
              }
            ]
          },
          {
            label: 'Security',
            items: [
              {
                id: 'security-score',
                label: 'Security Score',
                description: 'View overall security rating',
                action: () => {
                  const { securityScore } = getAuthStatus()
                  alert(`Security Score: ${securityScore}% - Good security posture`)
                }
              },
              {
                id: 'active-sessions',
                label: 'Active Sessions',
                description: 'View all active sessions',
                badge: '3',
                action: () => {
                  const { sessionCount } = getAuthStatus()
                  alert(`${sessionCount} active sessions found`)
                }
              },
              {
                id: 'passkey-status',
                label: 'Passkey Status',
                description: 'Check passkey registration',
                action: () => {
                  const { hasPasskey } = getAuthStatus()
                  alert(hasPasskey ? 'Passkeys are registered and active' : 'No passkeys registered')
                }
              }
            ]
          }
        ]
      },
      // Dynamic data function
      getData: () => {
        const { isAuthenticated, securityScore } = getAuthStatus()
        return { isAuthenticated, securityScore }
      }
    },
    // ORPC contract and identifier for server communication
    orpc: {
      contract: authContract,
      identifier: AUTH_HANDLER_ID
    }
  }
)