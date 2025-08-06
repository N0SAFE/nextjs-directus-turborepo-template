'use client'

import { useMemo } from 'react'
import { devToolsApi } from '../api'

/**
 * Hook to access the DevTool API client
 * Provides type-safe access to all DevTool server endpoints
 */
export function useDevToolAPI() {
  return useMemo(() => devToolsApi, [])
}

export type { DevToolsApi } from '../api'