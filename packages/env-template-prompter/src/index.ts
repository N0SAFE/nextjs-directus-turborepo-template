import { EnvTemplatePrompter } from './EnvTemplatePrompter.js';
import { EnvTemplatePrompterConfig } from './types/index.js';

// Main exports
export { EnvTemplatePrompter } from './EnvTemplatePrompter.js';

// Service exports
export { ConfigService } from './services/ConfigService.js';
export { TemplateParserService } from './services/TemplateParserService.js';
export { ValidationService } from './services/ValidationService.js';
export { TransformerService } from './services/TransformerService.js';
export { GroupingService } from './services/GroupingService.js';
export { PromptService } from './services/PromptService.js';
export { OutputService } from './services/OutputService.js';

// Type exports
export type {
  // Core types
  TemplateField,
  FieldOptions,
  ValidationResult,
  GroupedFields,
  GroupConfiguration,
  TransformContext,
  PromptContext,
  PromptResult,
  OutputOptions,
  OutputResult,
  RuntimeConfig,
  ProcessOptions,
  ProcessResult,
  EnvTemplatePrompterConfig,
  ServiceError,
  DebugHandler,
  CLIConfig,
  CLIResult,
  URLValidationOptions,
  NumberValidationOptions,
  StringValidationOptions,
  PortValidationOptions,
  
  // Plugin types
  Plugin,
  TransformerPlugin,
  ValidatorPlugin,
  PromptPlugin,
  OutputPlugin,
  
  // Service interfaces
  BaseService,
  IConfigService,
  ITemplateParserService,
  IValidationService,
  ITransformerService,
  IGroupingService,
  IPromptService,
  IOutputService,
  ServiceContainer
} from './types/index.js';

// Utility function for creating a prompter with default configuration
export function createEnvTemplatePrompter(config?: Partial<EnvTemplatePrompterConfig>) {
  return new EnvTemplatePrompter(config);
}

// Plugin system exports
export {
  getAllDefaultPlugins,
  getDefaultTransformerPlugins,
  getDefaultValidatorPlugins,
  PluginRegistry,
  type DefaultPlugins
} from './plugins/index.js';

// Individual default plugins
export {
  extractPortTransformer,
  extractHostnameTransformer,
  corsOriginsTransformer,
  generateSecretTransformer,
  booleanFlagTransformer,
  arrayFromCsvTransformer
} from './plugins/transformers/defaultTransformers.js';

export {
  urlValidator,
  numberValidator,
  stringValidator,
  booleanValidator,
  emailValidator,
  portValidator,
  jsonValidator,
  pathValidator
} from './plugins/validators/defaultValidators.js';

export {
  initJsUrlValidator,
  initJsNumberValidator,
  initJsStringValidator,
  initJsDateValidator
} from './plugins/validators/initJsCompatValidators.js';

// Version information
export const version = '1.0.0';
