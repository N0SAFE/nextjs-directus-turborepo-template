'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { DevToolPlugin, PluginRegistry, PluginRegistryState } from '../types'

interface PluginRegistryStore extends PluginRegistryState, PluginRegistry {}

/**
 * Plugin registry store using Zustand
 */
export const usePluginRegistry = create<PluginRegistryStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    plugins: new Map(),
    activePlugins: new Set(),
    selectedPlugin: null,

    // Methods
    register: (plugin: DevToolPlugin) => {
      const { plugins } = get()
      
      if (plugins.has(plugin.metadata.id)) {
        console.warn(`Plugin ${plugin.metadata.id} is already registered`)
        return
      }

      set((state) => {
        const newPlugins = new Map(state.plugins)
        newPlugins.set(plugin.metadata.id, plugin)
        
        const newActivePlugins = new Set(state.activePlugins)
        if (plugin.enabled !== false) {
          newActivePlugins.add(plugin.metadata.id)
        }

        return {
          plugins: newPlugins,
          activePlugins: newActivePlugins,
          selectedPlugin: state.selectedPlugin || (plugin.enabled !== false ? plugin.metadata.id : null)
        }
      })

      // Call lifecycle hook
      plugin.onRegister?.()
      
      if (plugin.enabled !== false) {
        plugin.onActivate?.()
      }
    },

    unregister: (pluginId: string) => {
      const { plugins, activePlugins } = get()
      const plugin = plugins.get(pluginId)
      
      if (!plugin) {
        console.warn(`Plugin ${pluginId} is not registered`)
        return
      }

      set((state) => {
        const newPlugins = new Map(state.plugins)
        const newActivePlugins = new Set(state.activePlugins)
        
        newPlugins.delete(pluginId)
        newActivePlugins.delete(pluginId)

        return {
          plugins: newPlugins,
          activePlugins: newActivePlugins,
          selectedPlugin: state.selectedPlugin === pluginId ? null : state.selectedPlugin
        }
      })

      // Call lifecycle hooks
      if (activePlugins.has(pluginId)) {
        plugin.onDeactivate?.()
      }
      plugin.onUnregister?.()
    },

    activate: (pluginId: string) => {
      const { plugins, activePlugins } = get()
      const plugin = plugins.get(pluginId)
      
      if (!plugin) {
        console.warn(`Plugin ${pluginId} is not registered`)
        return
      }

      if (activePlugins.has(pluginId)) {
        return // Already active
      }

      set((state) => ({
        activePlugins: new Set([...state.activePlugins, pluginId])
      }))

      plugin.onActivate?.()
    },

    deactivate: (pluginId: string) => {
      const { plugins, activePlugins } = get()
      const plugin = plugins.get(pluginId)
      
      if (!plugin) {
        console.warn(`Plugin ${pluginId} is not registered`)
        return
      }

      if (!activePlugins.has(pluginId)) {
        return // Already inactive
      }

      set((state) => {
        const newActivePlugins = new Set(state.activePlugins)
        newActivePlugins.delete(pluginId)
        
        return {
          activePlugins: newActivePlugins,
          selectedPlugin: state.selectedPlugin === pluginId ? null : state.selectedPlugin
        }
      })

      plugin.onDeactivate?.()
    },

    select: (pluginId: string | null) => {
      const { plugins, activePlugins } = get()
      
      if (pluginId && !plugins.has(pluginId)) {
        console.warn(`Plugin ${pluginId} is not registered`)
        return
      }

      if (pluginId && !activePlugins.has(pluginId)) {
        console.warn(`Plugin ${pluginId} is not active`)
        return
      }

      set({ selectedPlugin: pluginId })
    },

    getPlugins: () => Array.from(get().plugins.values()),

    getActivePlugins: () => {
      const { plugins, activePlugins } = get()
      return Array.from(activePlugins)
        .map(id => plugins.get(id))
        .filter(Boolean) as DevToolPlugin[]
    },

    getSelectedPlugin: () => {
      const { plugins, selectedPlugin } = get()
      return selectedPlugin ? plugins.get(selectedPlugin) || null : null
    },

    isRegistered: (pluginId: string) => get().plugins.has(pluginId),

    isActive: (pluginId: string) => get().activePlugins.has(pluginId),
  }))
)

/**
 * Hook to get plugin context for a specific plugin
 */
export const usePluginContext = (pluginId: string) => {
  const registry = usePluginRegistry()
  const plugin = registry.plugins.get(pluginId)
  
  if (!plugin) {
    throw new Error(`Plugin ${pluginId} is not registered`)
  }

  return {
    metadata: plugin.metadata,
    isActive: registry.activePlugins.has(pluginId),
    activate: () => registry.activate(pluginId),
    deactivate: () => registry.deactivate(pluginId),
  }
}