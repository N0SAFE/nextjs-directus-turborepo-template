'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
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
  const isInitialized = useRef(false)

  /**
   * Route change detection and real-time route info updates
   */
  useEffect(() => {
    // Prevent infinite loops by checking if already initialized with this route
    const currentPath = pathname + searchParams.toString()
    
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
  }, [pathname, searchParams]) // Remove api dependency to prevent loops

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
   * Enhanced API methods with caching and real-time updates
   */
  const enhancedAPI = {
    ...api,
    
    // Enhanced routes API
    routes: {
      // Create safe proxy methods to avoid calling API methods that don't exist
      getCurrentRouteRealtime: () => routeInfo,
      isRouteChanging: () => isRouteChanging,
      subscribeToRouteChanges: (callback: (routeInfo: any) => void) => {
        const handler = (event: CustomEvent) => callback(event.detail)
        window.addEventListener('devtools:route-changed', handler as EventListener)
        return () => window.removeEventListener('devtools:route-changed', handler as EventListener)
      },
      // Wrap API calls safely
      getRoutes: () => api['core-routes']?.getRoutes?.() || Promise.resolve([]),
      getCurrentRoute: () => api['core-routes']?.getCurrentRoute?.() || Promise.resolve(routeInfo),
      analyzeRoute: (input: any) => api['core-routes']?.analyzeRoute?.(input) || Promise.resolve(null),
      getRouteStats: () => api['core-routes']?.getRouteStats?.() || Promise.resolve({}),
      testApiEndpoints: () => api['core-routes']?.testApiEndpoints?.() || Promise.resolve([])
    },

    // Enhanced logs API with real-time streaming
    logs: {
      getLogs: (input?: any) => api['core-logs']?.getLogs?.(input) || Promise.resolve([]),
      getProcessInfo: () => api['core-logs']?.getProcessInfo?.() || Promise.resolve({}),
      clearLogs: () => api['core-logs']?.clearLogs?.() || Promise.resolve({ success: false }),
      subscribeToLogs: (callback: (logs: any[]) => void) => {
        return setAutoRefresh('logs', async () => {
          try {
            const logs = await api['core-logs']?.getLogs?.() || []
            callback(logs)
          } catch (error) {
            console.error('Failed to fetch logs:', error)
            callback([])
          }
        }, 5000) // Reduced frequency to prevent overload
      }
    },

    // Enhanced auth API with session monitoring
    auth: {
      getAuthConfig: () => api['core-auth']?.getAuthConfig?.() || Promise.resolve({}),
      getCurrentSession: () => api['core-auth']?.getCurrentSession?.() || Promise.resolve({}),
      getSecurityEvents: () => api['core-auth']?.getSecurityEvents?.() || Promise.resolve([]),
      getPasskeys: () => api['core-auth']?.getPasskeys?.() || Promise.resolve([]),
      subscribeToSessionChanges: (callback: (session: any) => void) => {
        return setAutoRefresh('auth-session', async () => {
          try {
            const session = await api['core-auth']?.getCurrentSession?.() || {}
            callback(session)
          } catch (error) {
            console.error('Failed to fetch session:', error)
            callback({})
          }
        }, 30000) // Reduced frequency
      }
    },

    // Enhanced CLI API with environment monitoring
    cli: {
      execute: (input: any) => api['core-cli']?.execute?.(input) || Promise.resolve({ success: false, output: '', error: 'Not available' }),
      getEnvironment: () => api['core-cli']?.getEnvironment?.() || Promise.resolve({}),
      getSystemInfo: () => api['core-cli']?.getSystemInfo?.() || Promise.resolve({}),
      subscribeToEnvironmentChanges: (callback: (env: any) => void) => {
        return setAutoRefresh('cli-env', async () => {
          try {
            const env = await api['core-cli']?.getEnvironment?.() || {}
            callback(env)
          } catch (error) {
            console.error('Failed to fetch environment:', error)
            callback({})
          }
        }, 60000) // Reduced frequency
      }
    },

    // Enhanced bundles API with dependency monitoring
    bundles: {
      getBundleStats: () => api['core-bundles']?.getBundleStats?.() || Promise.resolve({}),
      getDependencies: () => api['core-bundles']?.getDependencies?.() || Promise.resolve({ production: {}, development: {}, outdated: [] }),
      analyzeDependencies: () => api['core-bundles']?.analyzeDependencies?.() || Promise.resolve({}),
      subscribeToBundleChanges: (callback: (stats: any) => void) => {
        return setAutoRefresh('bundle-stats', async () => {
          try {
            const stats = await api['core-bundles']?.getBundleStats?.() || {}
            callback(stats)
          } catch (error) {
            console.error('Failed to fetch bundle stats:', error)
            callback({})
          }
        }, 120000) // Reduced frequency
      }
    },

    // Utility methods
    utils: {
      setAutoRefresh,
      clearAutoRefresh,
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

export type EnhancedDevToolAPI = ReturnType<typeof useEnhancedDevToolAPI>