/**
 * Plugin System Index
 * 
 * This module provides access to all default plugins and plugin management utilities.
 */

// Default Transformers
export {
  extractPortTransformer,
  extractHostnameTransformer,
  corsOriginsTransformer,
  generateSecretTransformer,
  booleanFlagTransformer,
  arrayFromCsvTransformer,
  defaultTransformerPlugins,
  getDefaultTransformerPlugins
} from './transformers/defaultTransformers.js';

// Default Validators
export {
  urlValidator,
  numberValidator,
  stringValidator,
  booleanValidator,
  emailValidator,
  portValidator,
  jsonValidator,
  pathValidator,
  defaultValidatorPlugins,
  getDefaultValidatorPlugins
} from './validators/defaultValidators.js';

// Init.js Compatible Validators
export {
  initJsUrlValidator,
  initJsNumberValidator,
  initJsStringValidator,
  initJsDateValidator,
  initJsCompatValidatorPlugins,
  getInitJsCompatValidatorPlugins
} from './validators/initJsCompatValidators.js';

// Plugin Collection Helper
import type { TransformerPlugin, ValidatorPlugin } from '../types/index.js';
import { getDefaultTransformerPlugins } from './transformers/defaultTransformers.js';
import { getDefaultValidatorPlugins } from './validators/defaultValidators.js';

/**
 * Complete collection of all default plugins
 */
export interface DefaultPlugins {
  transformers: TransformerPlugin[];
  validators: ValidatorPlugin[];
}

/**
 * Get all default plugins in a single collection
 */
export function getAllDefaultPlugins(): DefaultPlugins {
  return {
    transformers: getDefaultTransformerPlugins(),
    validators: getDefaultValidatorPlugins()
  };
}

/**
 * Plugin registry for managing custom plugins alongside defaults
 */
export class PluginRegistry {
  private transformers = new Map<string, TransformerPlugin>();
  private validators = new Map<string, ValidatorPlugin>();

  constructor(loadDefaults = true) {
    if (loadDefaults) {
      this.loadDefaultPlugins();
    }
  }

  /**
   * Load all default plugins
   */
  public loadDefaultPlugins(): void {
    const defaults = getAllDefaultPlugins();
    
    // Register default transformers
    for (const transformer of defaults.transformers) {
      this.transformers.set(transformer.name, transformer);
    }

    // Register default validators
    for (const validator of defaults.validators) {
      this.validators.set(validator.name, validator);
    }
  }

  /**
   * Register a custom transformer plugin
   */
  public registerTransformer(plugin: TransformerPlugin): void {
    this.transformers.set(plugin.name, plugin);
  }

  /**
   * Register a custom validator plugin
   */
  public registerValidator(plugin: ValidatorPlugin): void {
    this.validators.set(plugin.name, plugin);
  }

  /**
   * Get a transformer plugin by name
   */
  public getTransformer(name: string): TransformerPlugin | undefined {
    return this.transformers.get(name);
  }

  /**
   * Get a validator plugin by name
   */
  public getValidator(name: string): ValidatorPlugin | undefined {
    return this.validators.get(name);
  }

  /**
   * Get all registered transformers
   */
  public getAllTransformers(): TransformerPlugin[] {
    return Array.from(this.transformers.values());
  }

  /**
   * Get all registered validators
   */
  public getAllValidators(): ValidatorPlugin[] {
    return Array.from(this.validators.values());
  }

  /**
   * Check if a transformer exists
   */
  public hasTransformer(name: string): boolean {
    return this.transformers.has(name);
  }

  /**
   * Check if a validator exists
   */
  public hasValidator(name: string): boolean {
    return this.validators.has(name);
  }

  /**
   * Remove a transformer plugin
   */
  public unregisterTransformer(name: string): boolean {
    return this.transformers.delete(name);
  }

  /**
   * Remove a validator plugin
   */
  public unregisterValidator(name: string): boolean {
    return this.validators.delete(name);
  }

  /**
   * Clear all plugins
   */
  public clear(): void {
    this.transformers.clear();
    this.validators.clear();
  }

  /**
   * Get plugin statistics
   */
  public getStats(): { transformers: number; validators: number } {
    return {
      transformers: this.transformers.size,
      validators: this.validators.size
    };
  }
}
