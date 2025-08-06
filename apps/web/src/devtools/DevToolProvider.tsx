'use client'

import { useEffect } from 'react'
import { DevToolPanel } from './components'
import { usePluginRegistry } from './core'
import { authPlugin } from './plugins'

/**
 * DevTool Provider component that initializes plugins and renders the DevTool panel
 * Should only be used in development mode
 */
export function DevToolProvider() {
  const registry = usePluginRegistry()

  useEffect(() => {
    // Register built-in plugins
    registry.register(authPlugin)

    // Cleanup on unmount
    return () => {
      registry.unregister(authPlugin.metadata.id)
    }
  }, [registry])

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <DevToolPanel />
}