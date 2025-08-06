'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDevToolAPI } from './useDevToolAPI'

/**
 * Enhanced DevTool API hook with real-time event handling and optimized data fetching
 */
export function useEnhancedDevToolAPI() {
  const api = useDevToolAPI()
  const router = useRouter()
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
      setIsRouteChanging(true)
      try {
        // Update route info in real-time when route changes
        const currentRoute = await api.devtools.routes.getCurrentRoute()
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
  }, [pathname, searchParams, api])

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
      ...api.devtools.routes,
      getCurrentRouteRealtime: () => routeInfo,
      isRouteChanging: () => isRouteChanging,
      subscribeToRouteChanges: (callback: (routeInfo: any) => void) => {
        const handler = (event: CustomEvent) => callback(event.detail)
        window.addEventListener('devtools:route-changed', handler as EventListener)
        return () => window.removeEventListener('devtools:route-changed', handler as EventListener)
      }
    },

    // Enhanced logs API with real-time streaming
    logs: {
      ...api.devtools.logs,
      subscribeToLogs: (callback: (logs: any[]) => void) => {
        return setAutoRefresh('logs', async () => {
          const logs = await api.devtools.logs.getLogs()
          callback(logs)
        }, 2000) // Refresh every 2 seconds
      }
    },

    // Enhanced auth API with session monitoring
    auth: {
      ...api.devtools.auth,
      subscribeToSessionChanges: (callback: (session: any) => void) => {
        return setAutoRefresh('auth-session', async () => {
          const session = await api.devtools.auth.getCurrentSession()
          callback(session)
        }, 10000) // Check every 10 seconds
      }
    },

    // Enhanced CLI API with environment monitoring
    cli: {
      ...api.devtools.cli,
      subscribeToEnvironmentChanges: (callback: (env: any) => void) => {
        return setAutoRefresh('cli-env', async () => {
          const env = await api.devtools.cli.getEnvironment()
          callback(env)
        }, 30000) // Check every 30 seconds
      }
    },

    // Enhanced bundles API with dependency monitoring
    bundles: {
      ...api.devtools.bundles,
      subscribeToBundleChanges: (callback: (stats: any) => void) => {
        return setAutoRefresh('bundle-stats', async () => {
          const stats = await api.devtools.bundles.getBundleStats()
          callback(stats)
        }, 60000) // Check every minute
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