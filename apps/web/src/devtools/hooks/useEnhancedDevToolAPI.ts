'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useDevToolAPI } from './useDevToolAPI'

/**
 * Enhanced DevTool API hook with real-time event handling and optimized data fetching
 */
export function useEnhancedDevToolAPI() {
  const api = useDevToolAPI()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [routeInfo, setRouteInfo] = useState<any>(null)
  const [isRouteChanging, setIsRouteChanging] = useState(false)
  const refreshTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  /**
   * Route change detection and real-time route info updates
   */
  useEffect(() => {
    const updateRouteInfo = async () => {
      if (isRouteChanging) return // Prevent concurrent updates
      
      setIsRouteChanging(true)
      try {
        // Create route info from current navigation state to avoid API calls that might not be ready
        const currentRoute = {
          pathname,
          routeName: pathname === '/' ? 'Home' : pathname.split('/').filter(Boolean).pop() || pathname,
          params: {},
          query: Object.fromEntries(searchParams.entries())
        }
        
        setRouteInfo(currentRoute)
        
        // Notify other components about route change
        window.dispatchEvent(new CustomEvent('devtools:route-changed', {
          detail: { pathname, searchParams: Object.fromEntries(searchParams.entries()), routeInfo: currentRoute }
        }))
      } catch (error) {
        console.error('Failed to update route info:', error)
      } finally {
        setIsRouteChanging(false)
      }
    }

    updateRouteInfo()
  }, [pathname, searchParams, isRouteChanging])

  /**
   * Auto-refresh functionality for time-sensitive data
   */
  const setAutoRefresh = useCallback((key: string, callback: () => Promise<void>, interval: number) => {
    // Clear existing timer
    const existingTimer = refreshTimers.current.get(key)
    if (existingTimer) {
      clearInterval(existingTimer)
    }

    // Set new timer
    const timer = setInterval(async () => {
      try {
        await callback()
      } catch (error) {
        console.error(`Auto-refresh failed for ${key}:`, error)
      }
    }, interval)

    refreshTimers.current.set(key, timer)

    // Cleanup function
    return () => {
      clearInterval(timer)
      refreshTimers.current.delete(key)
    }
  }, [])

  /**
   * Clear auto-refresh timer
   */
  const clearAutoRefresh = useCallback((key: string) => {
    const timer = refreshTimers.current.get(key)
    if (timer) {
      clearInterval(timer)
      refreshTimers.current.delete(key)
    }
  }, [])

  /**
   * Safe API call wrapper that handles missing methods gracefully
   */
  const safeApiCall = useCallback(async (pluginId: string, method: string, input?: any) => {
    try {
      const plugin = (api as any)?.[pluginId]
      if (plugin && typeof plugin[method] === 'function') {
        return await plugin[method](input)
      }
      console.warn(`API method ${pluginId}.${method} not available`)
      return null
    } catch (error) {
      console.error(`API call failed: ${pluginId}.${method}`, error)
      return null
    }
  }, [api])

  /**
   * Enhanced API methods with caching and real-time updates
   */
  const enhancedAPI = {
    // Raw API access
    raw: api,
    
    // Enhanced routes API
    routes: {
      getCurrentRouteRealtime: () => routeInfo,
      isRouteChanging: () => isRouteChanging,
      subscribeToRouteChanges: (callback: (routeInfo: any) => void) => {
        const handler = (event: CustomEvent) => callback(event.detail)
        window.addEventListener('devtools:route-changed', handler as EventListener)
        return () => window.removeEventListener('devtools:route-changed', handler as EventListener)
      },
      getRoutes: () => safeApiCall('core-routes', 'getRoutes'),
      getCurrentRoute: () => safeApiCall('core-routes', 'getCurrentRoute'),
      analyzeRoute: (input: any) => safeApiCall('core-routes', 'analyzeRoute', input),
      getRouteStats: () => safeApiCall('core-routes', 'getRouteStats'),
      testApiEndpoints: () => safeApiCall('core-routes', 'testApiEndpoints')
    },

    // Enhanced logs API
    logs: {
      getLogs: (input?: any) => safeApiCall('core-logs', 'getLogs', input),
      getProcessInfo: () => safeApiCall('core-logs', 'getProcessInfo'),
      clearLogs: () => safeApiCall('core-logs', 'clearLogs'),
      subscribeToLogs: (callback: (logs: any[]) => void) => {
        return setAutoRefresh('logs', async () => {
          try {
            const logs = await safeApiCall('core-logs', 'getLogs') || []
            callback(logs)
          } catch (error) {
            console.error('Failed to fetch logs:', error)
            callback([])
          }
        }, 5000)
      }
    },

    // Enhanced auth API
    auth: {
      getAuthConfig: () => safeApiCall('core-auth', 'getAuthConfig'),
      getCurrentSession: () => safeApiCall('core-auth', 'getCurrentSession'),
      getSecurityEvents: () => safeApiCall('core-auth', 'getSecurityEvents'),
      getPasskeys: () => safeApiCall('core-auth', 'getPasskeys'),
      subscribeToSessionChanges: (callback: (session: any) => void) => {
        return setAutoRefresh('auth-session', async () => {
          try {
            const session = await safeApiCall('core-auth', 'getCurrentSession') || {}
            callback(session)
          } catch (error) {
            console.error('Failed to fetch session:', error)
            callback({})
          }
        }, 30000)
      }
    },

    // Enhanced CLI API
    cli: {
      execute: (input: any) => safeApiCall('core-cli', 'execute', input),
      getEnvironment: () => safeApiCall('core-cli', 'getEnvironment'),
      getSystemInfo: () => safeApiCall('core-cli', 'getSystemInfo'),
      subscribeToEnvironmentChanges: (callback: (env: any) => void) => {
        return setAutoRefresh('cli-env', async () => {
          try {
            const env = await safeApiCall('core-cli', 'getEnvironment') || {}
            callback(env)
          } catch (error) {
            console.error('Failed to fetch environment:', error)
            callback({})
          }
        }, 60000)
      }
    },

    // Enhanced bundles API
    bundles: {
      getBundleStats: () => safeApiCall('core-bundles', 'getBundleStats'),
      getDependencies: () => safeApiCall('core-bundles', 'getDependencies'),
      analyzeDependencies: () => safeApiCall('core-bundles', 'analyzeDependencies'),
      subscribeToBundleChanges: (callback: (stats: any) => void) => {
        return setAutoRefresh('bundle-stats', async () => {
          try {
            const stats = await safeApiCall('core-bundles', 'getBundleStats') || {}
            callback(stats)
          } catch (error) {
            console.error('Failed to fetch bundle stats:', error)
            callback({})
          }
        }, 120000)
      }
    },

    // Utility methods
    utils: {
      setAutoRefresh,
      clearAutoRefresh,
      safeApiCall,
      triggerEvent: (eventName: string, detail: any) => {
        window.dispatchEvent(new CustomEvent(`devtools:${eventName}`, { detail }))
      },
      subscribeToEvent: (eventName: string, callback: (detail: any) => void) => {
        const handler = (event: CustomEvent) => callback(event.detail)
        window.addEventListener(`devtools:${eventName}`, handler as EventListener)
        return () => window.removeEventListener(`devtools:${eventName}`, handler as EventListener)
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      refreshTimers.current.forEach(timer => clearInterval(timer))
      refreshTimers.current.clear()
    }
  }, [])

  return enhancedAPI
}

export type EnhancedDevToolAPI = ReturnType<typeof useEnhancedDevToolAPI>