import { DevToolPlugin, PluginMetadata, PluginContext, PluginGroup } from '../types'

/**
 * Abstract base class for creating plugins
 */
export abstract class BasePlugin implements DevToolPlugin {
  abstract metadata: PluginMetadata
  abstract groups: PluginGroup[]
  enabled?: boolean = true
  reduced?: import('../types').ReducedModeConfig

  /**
   * Called when the plugin is registered
   */
  onRegister?(): void | Promise<void> {
    // Override in subclass if needed
  }

  /**
   * Called when the plugin is activated
   */
  onActivate?(): void | Promise<void> {
    // Override in subclass if needed
  }

  /**
   * Called when the plugin is deactivated
   */
  onDeactivate?(): void | Promise<void> {
    // Override in subclass if needed
  }

  /**
   * Called when the plugin is unregistered
   */
  onUnregister?(): void | Promise<void> {
    // Override in subclass if needed
  }
}

/**
 * Utility function to create a simple plugin
 */
export function createPlugin(
  metadata: PluginMetadata,
  groups: PluginGroup[],
  pluginOptions: {
    enabled?: boolean
    onRegister?(): void | Promise<void>
    onActivate?(): void | Promise<void>
    onDeactivate?(): void | Promise<void>
    onUnregister?(): void | Promise<void>
    reduced?: import('../types').ReducedModeConfig
  } = {}
): DevToolPlugin {
  return {
    metadata,
    groups,
    enabled: pluginOptions.enabled ?? true,
    onRegister: pluginOptions.onRegister,
    onActivate: pluginOptions.onActivate,
    onDeactivate: pluginOptions.onDeactivate,
    onUnregister: pluginOptions.onUnregister,
    reduced: pluginOptions.reduced,
  }
}

/**
 * Utility function to create a simple plugin with a single page
 */
export function createSimplePlugin(
  metadata: PluginMetadata,
  component: React.ComponentType<{ context: PluginContext }>,
  options: {
    enabled?: boolean
    groupLabel?: string
    pageLabel?: string
    onRegister?(): void | Promise<void>
    onActivate?(): void | Promise<void>
    onDeactivate?(): void | Promise<void>
    onUnregister?(): void | Promise<void>
    reduced?: import('../types').ReducedModeConfig
  } = {}
): DevToolPlugin {
  return createPlugin(
    metadata,
    [
      {
        id: `${metadata.id}-group`,
        label: options.groupLabel || metadata.name,
        pages: [
          {
            id: `${metadata.id}-main`,
            label: options.pageLabel || 'Main',
            component,
            icon: metadata.icon
          }
        ]
      }
    ],
    options
  )
}

/**
 * Plugin utilities
 */
export const PluginUtils = {
  /**
   * Create a metadata object with defaults
   */
  createMetadata: (
    id: string,
    name: string,
    overrides: Partial<Omit<PluginMetadata, 'id' | 'name'>> = {}
  ): PluginMetadata => ({
    id,
    name,
    version: '1.0.0',
    ...overrides,
  }),

  /**
   * Validate plugin metadata
   */
  validateMetadata: (metadata: PluginMetadata): string[] => {
    const errors: string[] = []
    
    if (!metadata.id || typeof metadata.id !== 'string') {
      errors.push('Plugin ID is required and must be a string')
    }
    
    if (!metadata.name || typeof metadata.name !== 'string') {
      errors.push('Plugin name is required and must be a string')
    }
    
    if (!metadata.version || typeof metadata.version !== 'string') {
      errors.push('Plugin version is required and must be a string')
    }
    
    // ID should be kebab-case
    if (metadata.id && !/^[a-z0-9-]+$/.test(metadata.id)) {
      errors.push('Plugin ID should be kebab-case (lowercase letters, numbers, and hyphens only)')
    }
    
    return errors
  },

  /**
   * Check if a plugin is valid
   */
  isValidPlugin: (plugin: any): plugin is DevToolPlugin => {
    return (
      typeof plugin === 'object' &&
      plugin !== null &&
      'metadata' in plugin &&
      'groups' in plugin &&
      Array.isArray(plugin.groups) &&
      PluginUtils.validateMetadata(plugin.metadata).length === 0
    )
  },
}