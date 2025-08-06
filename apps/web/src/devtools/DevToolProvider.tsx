'use client'

import { useEffect } from 'react'
import { DevToolPanel } from './components'
import { usePluginRegistry } from './core'
import { DevToolPlugin } from './types'

export interface DevToolProviderProps {
  /** List of plugins to register */
  plugins?: DevToolPlugin[]
}

/**
 * DevTool Provider component that initializes plugins and renders the DevTool panel
 * Should only be used in development mode
 */
export function DevToolProvider({ plugins = [] }: DevToolProviderProps) {
  const registry = usePluginRegistry()

  useEffect(() => {
    // Register provided plugins
    plugins.forEach(plugin => {
      registry.register(plugin)
    })

    // Cleanup on unmount or when plugins change
    return () => {
      plugins.forEach(plugin => {
        registry.unregister(plugin.metadata.id)
      })
    }
  }, [registry, plugins])

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <DevToolPanel />
}