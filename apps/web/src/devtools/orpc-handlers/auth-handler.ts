import { SERVICE_KEYS } from '../services/registry'

/**
 * Auth Plugin ORPC Handler Factory (uses dependency injection)
 * Creates handlers for authentication operations with injected AuthService
 */
export function createAuthHandlers(services: Record<string, unknown>) {
  console.log('[Auth Handler] Creating auth handlers with services:', Object.keys(services))
  const authService = services[SERVICE_KEYS.AUTH_SERVICE] as any
  
  if (!authService) {
    console.warn('[Auth Plugin] AuthService not found in dependency injection, using fallback')
    return {
      getAuthConfig: async () => {
        console.log('[Auth Handler] Using fallback getAuthConfig')
        return {
          configPath: '',
          baseURL: '',
          basePath: '/api/auth',
          plugins: [],
          providers: [],
          configExists: false,
        }
      },
      getSessionInfo: async () => {
        console.log('[Auth Handler] Using fallback getSessionInfo')
        return {
          sessionId: 'unknown',
          userId: 'unknown',
          email: 'unknown',
          name: 'Unknown User',
          createdAt: new Date().toISOString(),
          expiresAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          ipAddress: 'unknown',
          userAgent: 'unknown',
          isActive: false,
          permissions: [],
          metadata: {
            loginMethod: 'unknown',
            twoFactorEnabled: false,
            passkeyRegistered: false,
          },
        }
      },
      getActiveSessions: async () => {
        console.log('[Auth Handler] Using fallback getActiveSessions')
        return []
      },
      getPasskeyInfo: async () => {
        console.log('[Auth Handler] Using fallback getPasskeyInfo')
        return {
          enabled: false,
          registeredKeys: [],
          supportedTransports: [],
          settings: {
            requireUserVerification: false,
            allowCrossPlatform: false,
            timeout: 60000,
          },
        }
      },
      getSecurityEvents: async () => {
        console.log('[Auth Handler] Using fallback getSecurityEvents')
        return []
      },
      getAuthStats: async () => {
        console.log('[Auth Handler] Using fallback getAuthStats')
        return {
          activeSessions: 0,
          totalSessions: 0,
          registeredPasskeys: 0,
          recentLogins: 0,
          successRate: 0,
          securityEvents: 0,
          suspiciousActivity: 0,
          lastLogin: new Date().toISOString(),
        }
      },
      testAuthEndpoints: async () => {
        console.log('[Auth Handler] Using fallback testAuthEndpoints')
        return []
      },
    }
  }

  console.log('[Auth Plugin] ✅ AuthService found, creating real handlers')
  return {
    getAuthConfig: async () => {
      console.log('[Auth Handler] Calling real getAuthConfig')
      return authService.getAuthConfig()
    },
    getSessionInfo: async (input: any) => {
      console.log('[Auth Handler] Calling real getSessionInfo with input:', input)
      return authService.getSessionInfo(input?.sessionId)
    },
    getActiveSessions: async () => {
      console.log('[Auth Handler] Calling real getActiveSessions')
      return authService.getActiveSessions()
    },
    getPasskeyInfo: async () => {
      console.log('[Auth Handler] Calling real getPasskeyInfo')
      return authService.getPasskeyInfo()
    },
    getSecurityEvents: async () => {
      console.log('[Auth Handler] Calling real getSecurityEvents')
      return authService.getSecurityEvents()
    },
    getAuthStats: async () => {
      console.log('[Auth Handler] Calling real getAuthStats')
      return authService.getAuthStats()
    },
    testAuthEndpoints: async () => {
      console.log('[Auth Handler] Calling real testAuthEndpoints')
      return authService.testAuthEndpoints()
    },
  }
}

