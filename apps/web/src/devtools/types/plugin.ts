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
 * Plugin option types for different UI components
 */
export type PluginOption = 
  | DialogOption
  | MenuOption
  | TabsOption
  | ToggleOption
  | ListOption
  | InputOption
  | CustomOption

export interface BaseOption {
  /** Unique identifier for this option */
  id: string
  /** Display label */
  label: string
  /** Optional description */
  description?: string
}

export interface DialogOption extends BaseOption {
  type: 'dialog'
  /** Dialog title */
  title: string
  /** Dialog content component */
  content: React.ComponentType<any>
  /** Dialog trigger button text */
  triggerText?: string
  /** Dialog size */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface MenuOption extends BaseOption {
  type: 'menu'
  /** Menu items */
  items: Array<{
    id: string
    label: string
    onClick: () => void
    icon?: ReactNode
  }>
  /** Menu trigger text */
  triggerText?: string
}

export interface TabsOption extends BaseOption {
  type: 'tabs'
  /** Tab items */
  tabs: Array<{
    id: string
    label: string
    content: React.ComponentType<any>
  }>
  /** Default active tab */
  defaultTab?: string
}

export interface ToggleOption extends BaseOption {
  type: 'toggle'
  /** Current toggle state */
  checked: boolean
  /** Toggle change handler */
  onChange: (checked: boolean) => void
  /** Toggle size */
  size?: 'sm' | 'md' | 'lg'
}

export interface ListOption extends BaseOption {
  type: 'list'
  /** List items */
  items: Array<{
    id: string
    label: string
    value: any
    secondary?: string
  }>
  /** Whether list is selectable */
  selectable?: boolean
  /** Selection change handler */
  onSelectionChange?: (selectedIds: string[]) => void
}

export interface InputOption extends BaseOption {
  type: 'input'
  /** Input type */
  inputType: 'text' | 'number' | 'email' | 'password' | 'search' | 'textarea'
  /** Current value */
  value: string | number
  /** Value change handler */
  onChange: (value: string | number) => void
  /** Placeholder text */
  placeholder?: string
  /** Whether input is disabled */
  disabled?: boolean
}

export interface CustomOption extends BaseOption {
  type: 'custom'
  /** Custom component to render */
  component: React.ComponentType<{ context: PluginContext }>
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
  /** Plugin options - array of different UI components to render */
  options: PluginOption[]
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