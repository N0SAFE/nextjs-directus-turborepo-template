'use client'

import { useMemo } from 'react'
import { devToolsApi } from '../api'

/**
 * Hook to access the DevTool API client
 * Provides access to DevTool server endpoints
 */
export function useDevToolAPI() {
  return useMemo(() => devToolsApi, [])
}

// Export the DevTools API type
export type DevToolsApi = typeof devToolsApi