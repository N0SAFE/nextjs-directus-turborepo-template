'use client'

import { useEffect, useRef } from 'react'
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
  const registeredPluginsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Register provided plugins that haven't been registered yet
    plugins.forEach(plugin => {
      if (!registeredPluginsRef.current.has(plugin.metadata.id) && !registry.isRegistered(plugin.metadata.id)) {
        registry.register(plugin)
        registeredPluginsRef.current.add(plugin.metadata.id)
      }
    })

    // Cleanup on unmount or when plugins change
    return () => {
      // Only unregister plugins that we registered in this component instance
      plugins.forEach(plugin => {
        if (registeredPluginsRef.current.has(plugin.metadata.id) && registry.isRegistered(plugin.metadata.id)) {
          registry.unregister(plugin.metadata.id)
          registeredPluginsRef.current.delete(plugin.metadata.id)
        }
      })
    }
  }, [plugins]) // Remove registry from dependencies as Zustand methods are stable

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <DevToolPanel />
}