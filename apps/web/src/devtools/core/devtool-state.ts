'use client'

import { create } from 'zustand'
import { DevToolState, DevToolPosition } from '../types'

/**
 * DevTool state management store
 */
interface DevToolStateStore {
  /** Current DevTool state */
  state: DevToolState
  /** Position configuration for normal state */
  position: DevToolPosition
  /** Currently active plugin tab */
  activeTab: string | null
  
  /** Set DevTool state */
  setState: (state: DevToolState) => void
  /** Set position configuration */
  setPosition: (position: Partial<DevToolPosition>) => void
  /** Set active plugin tab */
  setActiveTab: (pluginId: string | null) => void
  /** Toggle between states */
  toggle: () => void
  /** Cycle through states: none -> normal -> expanded -> none */
  cycle: () => void
}

/**
 * Zustand store for DevTool state management
 */
export const useDevToolState = create<DevToolStateStore>((set, get) => ({
  state: DevToolState.NONE,
  position: {
    side: 'right',
    size: 48
  },
  activeTab: null,

  setState: (state) => set({ state }),
  
  setPosition: (position) => set((prev) => ({
    position: { ...prev.position, ...position }
  })),
  
  setActiveTab: (pluginId) => set({ activeTab: pluginId }),
  
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
  }
}))