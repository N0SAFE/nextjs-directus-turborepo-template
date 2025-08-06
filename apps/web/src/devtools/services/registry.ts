/**
 * Service registry for dependency injection in DevTool plugins
 * This registry manages server-side services that can be injected into plugin handlers
 */

export interface ServiceRegistry {
  /** Register a service with a key */
  register<T>(key: string, service: T): void
  /** Get a registered service */
  get<T>(key: string): T | undefined
  /** Check if a service is registered */
  has(key: string): boolean
  /** Clear all services */
  clear(): void
}

class DevToolServiceRegistry implements ServiceRegistry {
  private services = new Map<string, any>()

  register<T>(key: string, service: T): void {
    this.services.set(key, service)
  }

  get<T>(key: string): T | undefined {
    return this.services.get(key)
  }

  has(key: string): boolean {
    return this.services.has(key)
  }

  clear(): void {
    this.services.clear()
  }
}

// Export singleton instance
export const serviceRegistry = new DevToolServiceRegistry()

// Service keys constants
export const SERVICE_KEYS = {
  DEVTOOLS_SERVICE: 'devtools-service',
} as const