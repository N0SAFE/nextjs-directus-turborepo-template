'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { DevToolPlugin, PluginRegistry, PluginRegistryState, PluginPage } from '../types'
import { routesPlugin, bundlesPlugin, cliPlugin, authPlugin } from './plugins'

interface PluginRegistryStore extends PluginRegistryState, PluginRegistry {
  // Additional methods for core plugins
  getCorePlugins(): DevToolPlugin[]
  getAllPlugins(): DevToolPlugin[]
  findCorePageById(pageId: string): { page: PluginPage; plugin: DevToolPlugin } | null
}

// Core plugins that are always available
const CORE_PLUGINS: DevToolPlugin[] = [routesPlugin, bundlesPlugin, cliPlugin, authPlugin]

/**
 * Plugin registry store using Zustand
 */
export const usePluginRegistry = create<PluginRegistryStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    plugins: new Map(),
    activePlugins: new Set(),
    selectedPage: null,
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
          selectedPage: state.selectedPlugin === pluginId ? null : state.selectedPage,
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

      set((state) => {
        const newActivePlugins = new Set(state.activePlugins)
        newActivePlugins.add(pluginId)
        return {
          activePlugins: newActivePlugins
        }
      })

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
          selectedPage: state.selectedPlugin === pluginId ? null : state.selectedPage,
          selectedPlugin: state.selectedPlugin === pluginId ? null : state.selectedPlugin
        }
      })

      plugin.onDeactivate?.()
    },

    selectPage: (pageId: string | null, pluginId?: string) => {
      const { plugins, activePlugins } = get()
      
      if (pageId && pluginId) {
        // Check core plugins first
        const corePlugin = CORE_PLUGINS.find(p => p.metadata.id === pluginId)
        if (corePlugin) {
          const foundPage = findPageInPlugin(corePlugin, pageId)
          if (foundPage) {
            set({ 
              selectedPage: pageId,
              selectedPlugin: pluginId
            })
            return
          }
        }

        // Then check registered plugins
        if (!plugins.has(pluginId)) {
          console.warn(`Plugin ${pluginId} is not registered`)
          return
        }

        if (!activePlugins.has(pluginId)) {
          console.warn(`Plugin ${pluginId} is not active`)
          return
        }

        // Find the page in the plugin
        const plugin = plugins.get(pluginId)!
        const foundPage = findPageInPlugin(plugin, pageId)
        
        if (!foundPage) {
          console.warn(`Page ${pageId} not found in plugin ${pluginId}`)
          return
        }
      }

      set({ 
        selectedPage: pageId,
        selectedPlugin: pluginId || null
      })
    },

    getPlugins: () => Array.from(get().plugins.values()),

    getActivePlugins: () => {
      const { plugins, activePlugins } = get()
      return Array.from(activePlugins)
        .map(id => plugins.get(id))
        .filter(Boolean) as DevToolPlugin[]
    },

    getSelectedPage: () => {
      const { plugins, selectedPage, selectedPlugin } = get()
      
      if (!selectedPage || !selectedPlugin) {
        return null
      }
      
      // Check core plugins first
      const corePlugin = CORE_PLUGINS.find(p => p.metadata.id === selectedPlugin)
      if (corePlugin) {
        const page = findPageInPlugin(corePlugin, selectedPage)
        if (page) {
          return { page, plugin: corePlugin }
        }
      }
      
      // Then check registered plugins
      const plugin = plugins.get(selectedPlugin)
      if (!plugin) {
        return null
      }
      
      const page = findPageInPlugin(plugin, selectedPage)
      if (!page) {
        return null
      }
      
      return { page, plugin }
    },

    isRegistered: (pluginId: string) => {
      // Core plugins are always "registered"
      if (CORE_PLUGINS.some(p => p.metadata.id === pluginId)) {
        return true
      }
      return get().plugins.has(pluginId)
    },

    isActive: (pluginId: string) => {
      // Core plugins are always "active"
      if (CORE_PLUGINS.some(p => p.metadata.id === pluginId)) {
        return true
      }
      return get().activePlugins.has(pluginId)
    },

    // Core plugin methods
    getCorePlugins: () => CORE_PLUGINS,

    getAllPlugins: () => {
      const { plugins, activePlugins } = get()
      const registeredPlugins = Array.from(activePlugins)
        .map(id => plugins.get(id))
        .filter(Boolean) as DevToolPlugin[]
      
      return [...CORE_PLUGINS, ...registeredPlugins]
    },

    findCorePageById: (pageId: string) => {
      for (const plugin of CORE_PLUGINS) {
        const page = findPageInPlugin(plugin, pageId)
        if (page) {
          return { page, plugin }
        }
      }
      return null
    },
  }))
)

/**
 * Helper function to find a page by ID in a plugin
 */
function findPageInPlugin(plugin: DevToolPlugin, pageId: string): PluginPage | null {
  for (const group of plugin.groups) {
    const page = findPageInPages(group.pages, pageId)
    if (page) return page
  }
  return null
}

/**
 * Helper function to recursively find a page by ID in an array of pages
 */
function findPageInPages(pages: PluginPage[], pageId: string): PluginPage | null {
  for (const page of pages) {
    if (page.id === pageId) return page
    if (page.children) {
      const childPage = findPageInPages(page.children, pageId)
      if (childPage) return childPage
    }
  }
  return null
}

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