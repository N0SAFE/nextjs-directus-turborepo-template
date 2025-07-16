import { TransformerPlugin, ValidatorPlugin } from './plugins.js';

// Template field definition
export interface TemplateField {
  key: string;
  type: string;
  options: FieldOptions;
  rawLine: string;
  lineNumber: number;
  group?: string;
}

// Field options from template syntax
export interface FieldOptions {
  value?: string;
  message?: string;
  group?: string;
  transformer?: string;
  source?: string;
  auto_derive?: boolean;
  validate?: string;
  min?: number;
  max?: number;
  allow?: string;
  label?: string;
  [key: string]: unknown;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  value?: string;
}

// Variable validation result
export interface VariableValidationResult {
  valid: boolean;
  value: string;
  errors: string[];
  warnings: string[];
  wasTransformed: boolean;
}

// Grouped fields for presentation
export interface GroupedFields {
  groups: Map<string, TemplateField[]>;
  ungrouped: TemplateField[];
  groupTitles: Map<string, string>;
  groupOrder: string[];
  groupInfo?: Map<string, {id: string, name: string, description?: string}>;
}

// Group configuration
export interface GroupConfiguration {
  groups: Record<string, string>;
  autoDetect: boolean;
  ungroupedTitle: string;
}

// Transform context for transformers
export interface TransformContext {
  sourceValue: string;
  allValues: Map<string, string>;
  field: TemplateField;
  templateFields: TemplateField[];
  isVariableValue?: boolean; // Flag to indicate if the value comes from a variable reference
}

// Global variables context for computed expressions
export interface GlobalVariablesContext {
  index: number; // Current field processing index
  iterCounters: Map<string, number>; // Namespace counters for $iter.namespace
}

// Prompt context for user interaction
export interface PromptContext {
  existingValues: Map<string, string>;
  groupTitle?: string;
  groupInfo?: { id: string, name: string, description?: string };
  skipExisting: boolean;
  interactive: boolean;
  globalVars?: GlobalVariablesContext; // Global variables for computed expressions
}

// Prompt result
export interface PromptResult {
  value: string;
  skipped: boolean;
  derived: boolean;
  error?: string;
}

// Output options
export interface OutputOptions {
  includeComments: boolean;
  preserveOrder: boolean;
  groupSeparators: boolean;
  timestampHeader: boolean;
}

// Output result
export interface OutputResult {
  success: boolean;
  path: string;
  content: string;
  fieldCount: number;
  errors: string[];
}

// Runtime configuration
export interface RuntimeConfig {
  debugMode: boolean;
  templatePath: string;
  outputPath: string;
  skipExisting: boolean;
  interactive: boolean;
}

// Main process options
export interface ProcessOptions {
  interactive?: boolean;
  skipExisting?: boolean;
  defaultValues?: Map<string, string>;
  outputFormat?: 'env' | 'json' | 'yaml';
}

// Main process result
export interface ProcessResult {
  success: boolean;
  fieldCount: number;
  outputPath: string;
  values: Map<string, string>;
  errors: string[];
  warnings: string[];
  duration: number;
}

// EnvTemplatePrompter main configuration
export interface EnvTemplatePrompterConfig {
  templatePath?: string;
  outputPath?: string;
  debugMode?: boolean;
  skipExisting?: boolean;
  interactive?: boolean;
  plugins?: {
    transformers?: TransformerPlugin[];
    validators?: ValidatorPlugin[];
  };
}

// Service error
export interface ServiceError {
  code: string;
  message: string;
  context?: Record<string, unknown>;
  recoverable: boolean;
}

// Debug handler
export type DebugHandler = (message: string, context?: string) => void;

// CLI configuration
export interface CLIConfig {
  templatePath: string;
  outputPath: string;
  debugMode: boolean;
  skipExisting: boolean;
  help: boolean;
  version: boolean;
}

// CLI result
export interface CLIResult {
  exitCode: number;
  message?: string;
  error?: string;
}

// URL validation options
export interface URLValidationOptions {
  requireProtocol?: boolean;
  allowedProtocols?: string[];
  requirePort?: boolean;
}

// Number validation options
export interface NumberValidationOptions {
  min?: number;
  max?: number;
  integer?: boolean;
  allow?: number[];
}

// String validation options
export interface StringValidationOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowEmpty?: boolean;
}

// Port validation options
export interface PortValidationOptions {
  allowWellKnown?: boolean;
  allowReserved?: boolean;
  customAllowed?: number[];
}

export * from './plugins.js';
export * from './services.js';
