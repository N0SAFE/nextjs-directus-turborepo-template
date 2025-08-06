import { SERVICE_KEYS } from '../services/registry'

/**
 * Auth Plugin ORPC Handler Factory (uses dependency injection)
 * Creates handlers for authentication operations with injected AuthService
 */
export function createAuthHandlers(services: Record<string, unknown>) {
  const authService = services[SERVICE_KEYS.AUTH_SERVICE] as any
  
  if (!authService) {
    console.warn('[Auth Plugin] AuthService not found in dependency injection')
    return {
      getAuthConfig: async () => ({
        configPath: '',
        baseURL: '',
        basePath: '/api/auth',
        plugins: [],
        providers: [],
        configExists: false,
      }),
      getSessionInfo: async () => ({
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
      }),
      getActiveSessions: async () => ([]),
      getPasskeyInfo: async () => ({
        enabled: false,
        registeredKeys: [],
        supportedTransports: [],
        settings: {
          requireUserVerification: false,
          allowCrossPlatform: false,
          timeout: 60000,
        },
      }),
      getSecurityEvents: async () => ([]),
      getAuthStats: async () => ({
        activeSessions: 0,
        totalSessions: 0,
        registeredPasskeys: 0,
        recentLogins: 0,
        successRate: 0,
        securityEvents: 0,
        suspiciousActivity: 0,
        lastLogin: new Date().toISOString(),
      }),
      testAuthEndpoints: async () => ([]),
    }
  }

  return {
    getAuthConfig: async () => authService.getAuthConfig(),
    getSessionInfo: async (input: any) => authService.getSessionInfo(input?.sessionId),
    getActiveSessions: async () => authService.getActiveSessions(),
    getPasskeyInfo: async () => authService.getPasskeyInfo(),
    getSecurityEvents: async () => authService.getSecurityEvents(),
    getAuthStats: async () => authService.getAuthStats(),
    testAuthEndpoints: async () => authService.testAuthEndpoints(),
  }
}

// Export unique identifier for this handler
export const AUTH_HANDLER_ID = 'auth-handler'