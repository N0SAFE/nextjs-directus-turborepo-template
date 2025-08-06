import { ReactNode } from 'react'

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
  /** Main component to render in the devtool panel */
  component: React.ComponentType<{ context: PluginContext }>
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
  /** Currently selected plugin ID */
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
  /** Select a plugin for display */
  select(pluginId: string | null): void
  /** Get all registered plugins */
  getPlugins(): DevToolPlugin[]
  /** Get all active plugins */
  getActivePlugins(): DevToolPlugin[]
  /** Get the currently selected plugin */
  getSelectedPlugin(): DevToolPlugin | null
  /** Check if a plugin is registered */
  isRegistered(pluginId: string): boolean
  /** Check if a plugin is active */
  isActive(pluginId: string): boolean
}