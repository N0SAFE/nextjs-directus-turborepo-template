import { DevToolPlugin, PluginMetadata, PluginContext } from '../types'

/**
 * Abstract base class for creating plugins
 */
export abstract class BasePlugin implements DevToolPlugin {
  abstract metadata: PluginMetadata
  abstract component: React.ComponentType<{ context: PluginContext }>
  enabled?: boolean = true

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
  component: React.ComponentType<{ context: PluginContext }>,
  options: {
    enabled?: boolean
    onRegister?(): void | Promise<void>
    onActivate?(): void | Promise<void>
    onDeactivate?(): void | Promise<void>
    onUnregister?(): void | Promise<void>
  } = {}
): DevToolPlugin {
  return {
    metadata,
    component,
    enabled: options.enabled ?? true,
    onRegister: options.onRegister,
    onActivate: options.onActivate,
    onDeactivate: options.onDeactivate,
    onUnregister: options.onUnregister,
  }
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
      'component' in plugin &&
      typeof plugin.component === 'function' &&
      PluginUtils.validateMetadata(plugin.metadata).length === 0
    )
  },
}