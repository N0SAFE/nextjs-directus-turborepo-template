import { ReactNode } from 'react'

/**
 * DevTool display states
 */
export enum DevToolState {
  /** Hidden/disabled */
  NONE = 'none',
  /** Small side bar (like Laravel DevBar) */
  NORMAL = 'normal', 
  /** Bottom center panel or separate browser window */
  EXPANDED = 'expanded'
}

/**
 * DevTool position configuration for normal state
 */
export interface DevToolPosition {
  /** Side of screen for normal state bar */
  side: 'left' | 'right' | 'top' | 'bottom'
  /** Size of the bar in pixels */
  size: number
}

/**
 * Plugin metadata and configuration
 */
export interface PluginMetadata {
  /** Unique identifier for the plugin */
  id: string
  /** Display name of the plugin */
  name: string
  /** Plugin description */
  description?: string
  /** Plugin version */
  version: string
  /** Plugin author */
  author?: string
  /** Plugin icon (Lucide icon name or custom React component) */
  icon?: string | ReactNode
}

/**
 * Plugin page for hierarchical navigation
 */
export interface PluginPage {
  /** Unique identifier for this page */
  id: string
  /** Display label */
  label: string
  /** Optional description */
  description?: string
  /** Page icon (Lucide icon name or custom React component) */
  icon?: string | ReactNode
  /** Component to render for this page */
  component: React.ComponentType<{ context: PluginContext }>
  /** Child pages for hierarchical structure */
  children?: PluginPage[]
  /** Badge text or number to display */
  badge?: string | number
  /** Whether this page is active */
  isActive?: boolean
}

/**
 * Plugin group for organizing pages
 */
export interface PluginGroup {
  /** Unique identifier for this group */
  id: string
  /** Display label */
  label: string
  /** Optional description */
  description?: string
  /** Group icon (Lucide icon name or custom React component) */
  icon?: string | ReactNode
  /** Pages in this group */
  pages: PluginPage[]
  /** Whether this group is collapsible */
  collapsible?: boolean
  /** Whether this group is initially collapsed */
  defaultCollapsed?: boolean
}

/**
 * Plugin lifecycle hooks
 */
export interface PluginLifecycle {
  /** Called when the plugin is registered */
  onRegister?(): void | Promise<void>
  /** Called when the plugin is activated */
  onActivate?(): void | Promise<void>
  /** Called when the plugin is deactivated */
  onDeactivate?(): void | Promise<void>
  /** Called when the plugin is unregistered */
  onUnregister?(): void | Promise<void>
}

/**
 * Plugin context provided to plugins
 */
export interface PluginContext {
  /** Plugin metadata */
  metadata: PluginMetadata
  /** Whether the plugin is currently active */
  isActive: boolean
  /** Activate the plugin */
  activate(): void
  /** Deactivate the plugin */
  deactivate(): void
}

/**
 * Base plugin interface that all plugins must implement
 */
export interface DevToolPlugin extends PluginLifecycle {
  /** Plugin metadata */
  metadata: PluginMetadata
  /** Plugin groups containing hierarchical pages */
  groups: PluginGroup[]
  /** Whether the plugin is enabled by default */
  enabled?: boolean
}

/**
 * Plugin registry state
 */
export interface PluginRegistryState {
  /** All registered plugins */
  plugins: Map<string, DevToolPlugin>
  /** Currently active plugin IDs */
  activePlugins: Set<string>
  /** Currently selected page ID */
  selectedPage: string | null
  /** Currently selected plugin ID (for page context) */
  selectedPlugin: string | null
}

/**
 * Plugin registry methods
 */
export interface PluginRegistry {
  /** Register a new plugin */
  register(plugin: DevToolPlugin): void
  /** Unregister a plugin */
  unregister(pluginId: string): void
  /** Activate a plugin */
  activate(pluginId: string): void
  /** Deactivate a plugin */
  deactivate(pluginId: string): void
  /** Select a page for display */
  selectPage(pageId: string | null, pluginId?: string): void
  /** Get all registered plugins */
  getPlugins(): DevToolPlugin[]
  /** Get all active plugins */
  getActivePlugins(): DevToolPlugin[]
  /** Get the currently selected page */
  getSelectedPage(): { page: PluginPage; plugin: DevToolPlugin } | null
  /** Check if a plugin is registered */
  isRegistered(pluginId: string): boolean
  /** Check if a plugin is active */
  isActive(pluginId: string): boolean
}