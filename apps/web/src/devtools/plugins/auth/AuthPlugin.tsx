'use client'

import React from 'react'
import { oc } from '@orpc/contract'
import { User, Shield, Clock, Key, Users, AlertTriangle } from 'lucide-react'
import { Badge } from '@repo/ui/components/shadcn/badge'
import { createPlugin, PluginUtils } from '../../sdk'
import { AuthPlugin } from './AuthComponents'
import z from 'zod/v4'

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
 * Custom component for auth reduced mode display
 */
function AuthReducedDisplay({ context }: { context: any }) {
  const { isAuthenticated, securityScore } = getAuthStatus()
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  return (
    <div className="flex items-center gap-1">
      {isAuthenticated ? (
        <Shield className="h-3 w-3 text-green-600" />
      ) : (
        <AlertTriangle className="h-3 w-3 text-red-600" />
      )}
      <span className={`text-xs font-mono ${getScoreColor(securityScore)}`}>
        {securityScore}%
      </span>
    </div>
  )
}

/**
 * Auth DevTool Plugin - Comprehensive authentication and security management
 */
export const authPlugin = createPlugin(
  PluginUtils.createMetadata(
    'auth',
    'Authentication',
    {
      description: 'User authentication and session management',
      author: 'DevTools Team',
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
          component: AuthPlugin
        },
        {
          id: 'sessions',
          label: 'All Sessions',
          description: 'Manage all active user sessions',
          icon: 'Users',
          component: AuthPlugin
        },
        {
          id: 'passkeys',
          label: 'Passkeys',
          description: 'Passkey authentication management',
          icon: 'Key',
          component: AuthPlugin
        },
        {
          id: 'security',
          label: 'Security Events',
          description: 'Authentication security audit log',
          icon: 'Shield',
          component: AuthPlugin
        },
        {
          id: 'config',
          label: 'Configuration',
          description: 'Better Auth configuration and setup',
          icon: 'Settings',
          component: AuthPlugin
        }
      ]
    }
  ],
  {
    enabled: true,
    onRegister: () => {
      console.log('[DevTools] Auth plugin registered')
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
      identifier: 'auth-handler'
    }
  }
)