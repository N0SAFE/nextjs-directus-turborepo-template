/**
 * Server-side service setup for DevTool dependency injection
 * This file should only be imported on the server side (API routes)
 */

import { serviceRegistry, SERVICE_KEYS } from './registry'

/**
 * Initialize server-side services for dependency injection
 * This should be called only on the server side (e.g., in API routes)
 */
export function initializeServerServices() {
  // Only initialize if we're on the server side
  if (typeof window !== 'undefined') {
    throw new Error('initializeServerServices should only be called on the server side')
  }

  // Lazy import server-only dependencies
  const { DevtoolsService } = require('./devtools.service')
  
  // Register services
  serviceRegistry.register(SERVICE_KEYS.DEVTOOLS_SERVICE, new DevtoolsService())
  
  console.log('[DevTools] Server services initialized')
}

/**
 * Get a service from the registry with type safety
 */
export function getService<T>(key: string): T | undefined {
  return serviceRegistry.get<T>(key)
}