import * as fs from 'fs/promises';
import * as path from 'path';

export class AuthService {
  private readonly projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
  }

  // Get Better Auth configuration information
  async getAuthConfig() {
    try {
      // Look for Better Auth configuration files
      const configPaths = [
        'src/lib/auth/index.ts',
        'src/lib/auth.ts',
        'lib/auth.ts',
        'auth.config.ts',
      ];

      let configContent = '';
      let configPath = '';

      for (const configFile of configPaths) {
        try {
          const fullPath = path.join(this.projectRoot, configFile);
          configContent = await fs.readFile(fullPath, 'utf-8');
          configPath = configFile;
          break;
        } catch {
          continue;
        }
      }

      // Extract configuration details from the file
      const plugins = this.extractPlugins(configContent);
      const providers = this.extractProviders(configContent);
      const baseURL = this.extractBaseURL(configContent);
      const basePath = this.extractBasePath(configContent);

      return {
        configPath,
        baseURL,
        basePath: basePath || '/api/auth',
        plugins,
        providers,
        configExists: configContent.length > 0,
      };
    } catch (error) {
      console.error('Error getting auth config:', error);
      return {
        configPath: '',
        baseURL: '',
        basePath: '/api/auth',
        plugins: [],
        providers: [],
        configExists: false,
      };
    }
  }

  // Get session information (this would typically come from a request context)
  async getSessionInfo(sessionId?: string) {
    // In a real implementation, you'd query the database or session store
    // For now, we'll return mock data showing what's possible
    return {
      sessionId: sessionId || 'mock-session-id',
      userId: 'user-123',
      email: 'user@example.com',
      name: 'John Doe',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
      lastActivity: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      isActive: true,
      permissions: ['read', 'write'],
      metadata: {
        loginMethod: 'email',
        twoFactorEnabled: false,
        passkeyRegistered: true,
      },
    };
  }

  // Get all active sessions
  async getActiveSessions() {
    // Mock implementation - would query session store
    const sessions = [];
    const sessionCount = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < sessionCount; i++) {
      sessions.push({
        id: `session-${i + 1}`,
        userId: 'user-123',
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        lastActivity: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: i === 0 ? 'Current Session' : `Device ${i + 1}`,
        isActive: Math.random() > 0.3,
        location: ['New York', 'San Francisco', 'London', 'Tokyo'][Math.floor(Math.random() * 4)],
      });
    }

    return sessions.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  }

  // Get passkey information
  async getPasskeyInfo() {
    // Mock implementation - would query passkey store
    return {
      enabled: true,
      registeredKeys: [
        {
          id: 'passkey-1',
          name: 'MacBook Pro Touch ID',
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          lastUsed: new Date(Date.now() - 3600000).toISOString(),
          type: 'platform',
          credentialId: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        },
        {
          id: 'passkey-2',
          name: 'iPhone Face ID',
          createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
          lastUsed: new Date(Date.now() - 86400000).toISOString(),
          type: 'platform',
          credentialId: 'XYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWxyz+/=',
        },
      ],
      supportedTransports: ['usb', 'nfc', 'ble', 'internal'],
      settings: {
        requireUserVerification: true,
        allowCrossPlatform: false,
        timeout: 60000,
      },
    };
  }

  // Get security events and audit log
  async getSecurityEvents() {
    // Mock implementation - would query security event log
    const events = [];
    const eventTypes = [
      'login_success',
      'login_failed',
      'logout',
      'password_changed',
      'passkey_registered',
      'passkey_used',
      'session_expired',
      'suspicious_activity',
    ];

    for (let i = 0; i < 20; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      events.push({
        id: `event-${i + 1}`,
        type: eventType,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: `Browser ${i + 1}`,
        location: ['New York', 'San Francisco', 'London', 'Tokyo'][Math.floor(Math.random() * 4)],
        success: eventType !== 'login_failed' && eventType !== 'suspicious_activity',
        details: this.getEventDetails(eventType),
      });
    }

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Get authentication statistics
  async getAuthStats() {
    const sessions = await this.getActiveSessions();
    const events = await this.getSecurityEvents();
    const passkeys = await this.getPasskeyInfo();

    const loginEvents = events.filter(e => e.type === 'login_success' || e.type === 'login_failed');
    const successfulLogins = events.filter(e => e.type === 'login_success');
    const failedLogins = events.filter(e => e.type === 'login_failed');

    return {
      activeSessions: sessions.filter(s => s.isActive).length,
      totalSessions: sessions.length,
      registeredPasskeys: passkeys.registeredKeys.length,
      recentLogins: loginEvents.length,
      successRate: loginEvents.length > 0 ? (successfulLogins.length / loginEvents.length) * 100 : 100,
      securityEvents: events.length,
      suspiciousActivity: events.filter(e => e.type === 'suspicious_activity').length,
      lastLogin: successfulLogins[0]?.timestamp || new Date().toISOString(),
    };
  }

  // Test authentication endpoints
  async testAuthEndpoints() {
    const endpoints = [
      { path: '/api/auth/session', method: 'GET', description: 'Get current session' },
      { path: '/api/auth/signin', method: 'POST', description: 'Sign in endpoint' },
      { path: '/api/auth/signout', method: 'POST', description: 'Sign out endpoint' },
      { path: '/api/auth/signup', method: 'POST', description: 'Sign up endpoint' },
      { path: '/api/auth/passkey/register', method: 'POST', description: 'Register passkey' },
      { path: '/api/auth/passkey/authenticate', method: 'POST', description: 'Authenticate with passkey' },
    ];

    const results = [];

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      
      try {
        // In a real implementation, you'd make actual HTTP requests
        // For now, we'll simulate the test results
        const duration = Math.random() * 100 + 50; // 50-150ms
        const success = Math.random() > 0.1; // 90% success rate for demo
        
        results.push({
          ...endpoint,
          success,
          status: success ? 200 : 500,
          duration: Math.round(duration),
          response: success ? { message: 'OK' } : { error: 'Service unavailable' },
        });
      } catch (error) {
        results.push({
          ...endpoint,
          success: false,
          status: 500,
          duration: Date.now() - startTime,
          response: { error: 'Test failed' },
        });
      }
    }

    return results;
  }

  // Helper methods
  private extractPlugins(content: string): string[] {
    const plugins = [];
    
    // Look for plugin imports and usage
    if (content.includes('passkeyClient')) plugins.push('passkey');
    if (content.includes('twoFactorClient')) plugins.push('two-factor');
    if (content.includes('sessionClient')) plugins.push('session');
    if (content.includes('organizationClient')) plugins.push('organization');
    if (content.includes('adminClient')) plugins.push('admin');
    
    return plugins;
  }

  private extractProviders(content: string): string[] {
    const providers = [];
    
    // Look for provider configurations
    if (content.includes('google')) providers.push('google');
    if (content.includes('github')) providers.push('github');
    if (content.includes('discord')) providers.push('discord');
    if (content.includes('apple')) providers.push('apple');
    if (content.includes('facebook')) providers.push('facebook');
    if (content.includes('twitter')) providers.push('twitter');
    
    return providers;
  }

  private extractBaseURL(content: string): string {
    const match = content.match(/baseURL:\s*['"`]([^'"`]+)['"`]/);
    return match ? match[1] : '';
  }

  private extractBasePath(content: string): string {
    const match = content.match(/basePath:\s*['"`]([^'"`]+)['"`]/);
    return match ? match[1] : '';
  }

  private getEventDetails(eventType: string): string {
    const details = {
      login_success: 'User successfully authenticated',
      login_failed: 'Invalid credentials provided',
      logout: 'User signed out',
      password_changed: 'Password updated successfully',
      passkey_registered: 'New passkey registered',
      passkey_used: 'Authentication via passkey',
      session_expired: 'Session automatically expired',
      suspicious_activity: 'Multiple failed login attempts detected',
    };

    return details[eventType as keyof typeof details] || 'Authentication event';
  }
}