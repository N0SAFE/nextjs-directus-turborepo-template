'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DevToolState, DevToolPosition } from '../types'

/**
 * DevTool settings that can be configured
 */
export interface DevToolPreferences {
  /** Whether to show tooltips in normal mode */
  showTooltips: boolean
  /** Whether to auto-expand on first visit */
  autoExpand: boolean
  /** Maximum number of plugins to show in normal mode */
  maxNormalPlugins: number
  /** Whether to enable animations */
  enableAnimations: boolean
}

/**
 * DevTool state management store
 */
interface DevToolStateStore {
  /** Current DevTool state */
  state: DevToolState
  /** Position configuration for normal state */
  position: DevToolPosition
  /** Pinned plugin IDs that should show in reduced mode */
  pinnedPlugins: Set<string>
  /** DevTool settings */
  settings: DevToolPreferences
  
  /** Set DevTool state */
  setState: (state: DevToolState) => void
  /** Set position configuration */
  setPosition: (position: Partial<DevToolPosition>) => void
  /** Toggle between states */
  toggle: () => void
  /** Cycle through states: none -> normal -> expanded -> none */
  cycle: () => void
  /** Pin a plugin to show in reduced mode */
  pinPlugin: (pluginId: string) => void
  /** Unpin a plugin from reduced mode */
  unpinPlugin: (pluginId: string) => void
  /** Check if a plugin is pinned */
  isPluginPinned: (pluginId: string) => boolean
  /** Update settings */
  updateSettings: (settings: Partial<DevToolPreferences>) => void
}

/**
 * Default settings
 */
const defaultSettings: DevToolPreferences = {
  showTooltips: true,
  autoExpand: false,
  maxNormalPlugins: 5,
  enableAnimations: true
}

/**
 * Zustand store for DevTool state management with localStorage persistence
 */
export const useDevToolState = create<DevToolStateStore>()(
  persist(
    (set, get) => ({
      state: DevToolState.NONE,
      position: {
        side: 'right',
        size: 48
      },
      pinnedPlugins: new Set<string>(),
      settings: defaultSettings,

      setState: (state) => set({ state }),
      
      setPosition: (position) => set((prev) => ({
        position: { ...prev.position, ...position }
      })),
      
      toggle: () => {
        const { state } = get()
        if (state === DevToolState.NONE) {
          set({ state: DevToolState.NORMAL })
        } else {
          set({ state: DevToolState.NONE })
        }
      },
      
      cycle: () => {
        const { state } = get()
        switch (state) {
          case DevToolState.NONE:
            set({ state: DevToolState.NORMAL })
            break
          case DevToolState.NORMAL:
            set({ state: DevToolState.EXPANDED })
            break
          case DevToolState.EXPANDED:
            set({ state: DevToolState.NONE })
            break
        }
      },

      pinPlugin: (pluginId) => set((state) => ({
        pinnedPlugins: new Set([...state.pinnedPlugins, pluginId])
      })),

      unpinPlugin: (pluginId) => set((state) => {
        const newPinned = new Set(state.pinnedPlugins)
        newPinned.delete(pluginId)
        return { pinnedPlugins: newPinned }
      }),

      isPluginPinned: (pluginId) => get().pinnedPlugins.has(pluginId),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      }))
    }),
    {
      name: 'devtool-state',
      // Custom storage implementation that handles Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)
          // Convert pinned plugins array back to Set
          if (parsed.state?.pinnedPlugins && Array.isArray(parsed.state.pinnedPlugins)) {
            parsed.state.pinnedPlugins = new Set(parsed.state.pinnedPlugins)
          }
          return parsed
        },
        setItem: (name, value) => {
          // Convert Set to array for serialization
          const serializable = {
            ...value,
            state: {
              ...value.state,
              pinnedPlugins: Array.from(value.state.pinnedPlugins)
            }
          }
          localStorage.setItem(name, JSON.stringify(serializable))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      // Only persist position, pinnedPlugins, and settings (not the current state)
      partialize: (state) => ({
        position: state.position,
        pinnedPlugins: state.pinnedPlugins,
        settings: state.settings
      }) as Partial<DevToolStateStore>
    }
  )
)