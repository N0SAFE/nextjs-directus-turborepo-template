import type {
  RuntimeConfig,
  TemplateField,
  ValidationResult,
  VariableValidationResult,
  GroupedFields,
  GroupConfiguration,
  TransformContext,
  PromptContext,
  PromptResult,
  OutputOptions,
  OutputResult,
  DebugHandler,
  TransformerPlugin,
  ValidatorPlugin
} from './index.js';

// Forward declaration for ServiceContainer to avoid circular dependency
export interface ServiceContainer {
  configService: IConfigService;
  templateParserService: ITemplateParserService;
  validationService: IValidationService;
  transformerService: ITransformerService;
  groupingService: IGroupingService;
  promptService: IPromptService;
  outputService: IOutputService;
}

// Base service interface
export interface BaseService {
  readonly serviceName: string;
}

// Config service interface
export interface IConfigService extends BaseService {
  setDebugMode(enabled: boolean): void;
  getConfig(): RuntimeConfig;
  updateConfig(partial: Partial<RuntimeConfig>): void;
  debug(message: string, context?: string): void;
  addDebugHandler(handler: DebugHandler): void;
  removeDebugHandler(handler: DebugHandler): void;
  validateConfig(): ValidationResult;
}

// Template parser service interface
export interface ITemplateParserService extends BaseService {
  parseTemplate(content: string): TemplateField[];
  parseTemplateFile(filePath: string): Promise<TemplateField[]>;
  extractFieldDefinition(line: string): TemplateField | null;
  parseFieldOptions(optionsString: string): Record<string, unknown>;
  validateTemplateStructure(fields: TemplateField[]): ValidationResult;
  resolveIncludes(content: string): string;
  extractComments(content: string): Map<string, string>;
}

// Validation service interface
export interface IValidationService extends BaseService {
  validateField(value: string, field: TemplateField): Promise<ValidationResult>;
  validateVariable(
    variableName: string, 
    value: string, 
    sourceField: TemplateField,
    context: any
  ): Promise<VariableValidationResult>;
  validateUrl(url: string): boolean;
  validateNumber(value: string, min?: number, max?: number, allow?: number[]): boolean;
  validateString(value: string, minLength?: number, maxLength?: number): boolean;
  validateBoolean(value: string): boolean;
  validateEmail(value: string): boolean;
  validatePort(value: string, allowWellKnown?: boolean): boolean;
  registerValidator(plugin: ValidatorPlugin): void;
  unregisterValidator(name: string): void;
  getRegisteredValidators(): ValidatorPlugin[];
  setServiceContainer(serviceContainer: ServiceContainer): void;
}

// Transformer service interface
export interface ITransformerService extends BaseService {
  applyTransformers(field: TemplateField, context: TransformContext): Promise<string>;
  transformValue(
    value: string, 
    transformerName: string, 
    params: Record<string, string>, 
    context: TransformContext
  ): Promise<string>;
  registerTransformer(plugin: TransformerPlugin): void;
  unregisterTransformer(name: string): void;
  getRegisteredTransformers(): TransformerPlugin[];
  getBuiltInTransformers(): TransformerPlugin[];
  resolveSourceValue(field: TemplateField, context: TransformContext): Promise<string>;
  resolvePlaceholders(value: string, context: TransformContext): Promise<string>;
  setValidationService(validationService: IValidationService): void;
}

// Grouping service interface
export interface IGroupingService extends BaseService {
  groupFields(fields: TemplateField[], config?: GroupConfiguration): GroupedFields;
  parseExplicitGroups(configString: string): Record<string, string>;
  extractGroupConfiguration(fields: TemplateField[]): GroupConfiguration | null;
  autoDetectGroups(fields: TemplateField[]): Record<string, string>;
  generateGroupTitle(groupKey: string): string;
  orderGroups(groups: Map<string, TemplateField[]>, config: GroupConfiguration): string[];
  prioritizeGroups(groupNames: string[]): string[];
  assignFieldToGroup(field: TemplateField, groups: Record<string, string>): string | null;
  validateGroupConfiguration(config: GroupConfiguration): ValidationResult;
}

// Prompt service interface
export interface IPromptService extends BaseService {
  promptForField(field: TemplateField, context: PromptContext): Promise<PromptResult>;
  promptForGroup(
    groupName: string, 
    fields: TemplateField[], 
    context: PromptContext
  ): Promise<Map<string, PromptResult>>;
  shouldSkipField(field: TemplateField, context: PromptContext): boolean;
  shouldAutoDerive(field: TemplateField, context: PromptContext): Promise<boolean>;
  generatePromptMessage(field: TemplateField): string;
  displayGroupHeader(groupName: string, groupTitle: string): void;
  displayValidationError(error: string): void;
  displaySummary(results: Map<string, PromptResult>): void;
  collectUserInput(field: TemplateField, message: string, context?: PromptContext): Promise<string>;
  validateAndRetry(field: TemplateField, context: PromptContext): Promise<string>;
  processNonInteractive(
    fields: TemplateField[], 
    defaultValues: Map<string, string>
  ): Promise<Map<string, PromptResult>>;
}

// Output service interface
export interface IOutputService extends BaseService {
  generateEnvFile(
    values: Map<string, string>, 
    template: TemplateField[], 
    options?: OutputOptions
  ): string;
  writeEnvFile(content: string, path: string): Promise<OutputResult>;
  formatFieldValue(key: string, value: string, field: TemplateField): string;
  addComments(content: string, fields: TemplateField[]): string;
  addGroupSeparators(content: string, groups: GroupedFields): string;
  addHeader(content: string, timestamp: boolean): string;
  createBackup(path: string): Promise<string>;
  validateOutput(content: string): ValidationResult;
  generateDockerComposeEnv(values: Map<string, string>): string;
  generateJSONConfig(values: Map<string, string>): string;
  generateYAMLConfig(values: Map<string, string>): string;
  ensureDirectoryExists(path: string): Promise<void>;
  checkWritePermissions(path: string): Promise<boolean>;
}
