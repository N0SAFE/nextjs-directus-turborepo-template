'use client'

import { useMemo } from 'react'
import { devToolsApi } from '../api'
import type { DevtoolsContract } from '../contracts'

/**
 * Hook to access the DevTool API client
 * Provides type-safe access to all DevTool server endpoints
 */
export function useDevToolAPI() {
  return useMemo(() => devToolsApi, [])
}

// Export the properly typed DevTools API
export type DevToolsApi = typeof devToolsApi
export type { DevtoolsContract }