import type {
  TemplateField,
  TransformContext,
  TransformerPlugin
} from '../types/index.js';
import type { ITransformerService, IConfigService } from '../types/services.js';
import { getDefaultTransformerPlugins } from '../plugins/transformers/defaultTransformers.js';

export class TransformerService implements ITransformerService {
  public readonly serviceName = 'TransformerService';
  
  private transformers = new Map<string, TransformerPlugin>();

  constructor(
    private configService: IConfigService
  ) {
    this.registerBuiltInTransformers();
  }

  public async applyTransformers(field: TemplateField, context: TransformContext): Promise<string> {
    this.configService.debug(`Applying transformers for field: ${field.key}`, this.serviceName);

    if (!field.options.transformer) {
      this.configService.debug(`No transformer specified for ${field.key}`, this.serviceName);
      return context.sourceValue;
    }

    const transformerName = String(field.options.transformer);
    const params = this.extractTransformerParams(field.options);

    try {
      const result = await this.transformValue(context.sourceValue, transformerName, params, context);
      this.configService.debug(
        `Transformer ${transformerName} for ${field.key}: "${context.sourceValue}" -> "${result}"`,
        this.serviceName
      );
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown transformer error';
      this.configService.debug(`Transformer error for ${field.key}: ${message}`, this.serviceName);
      throw new Error(`Transformer ${transformerName} failed for ${field.key}: ${message}`);
    }
  }

  public async transformValue(
    value: string,
    transformerName: string,
    params: Record<string, string>,
    context: TransformContext
  ): Promise<string> {
    const transformer = this.transformers.get(transformerName);
    if (!transformer) {
      throw new Error(`Unknown transformer: ${transformerName}`);
    }

    return transformer.transform(value, params, context);
  }

  public registerTransformer(plugin: TransformerPlugin): void {
    this.transformers.set(plugin.name, plugin);
    this.configService.debug(`Registered transformer plugin: ${plugin.name}`, this.serviceName);
  }

  public unregisterTransformer(name: string): void {
    const removed = this.transformers.delete(name);
    if (removed) {
      this.configService.debug(`Unregistered transformer plugin: ${name}`, this.serviceName);
    }
  }

  public getRegisteredTransformers(): TransformerPlugin[] {
    return Array.from(this.transformers.values());
  }

  public getBuiltInTransformers(): TransformerPlugin[] {
    return [
      'extract_port',
      'extract_hostname',
      'cors_origins',
      'generate_secret',
      'boolean_flag',
      'array_from_csv'
    ].map(name => this.transformers.get(name)).filter(Boolean) as TransformerPlugin[];
  }

  public resolveSourceValue(field: TemplateField, context: TransformContext): string {
    if (!field.options.source) {
      return '';
    }

    const source = String(field.options.source);
    
    // Handle variable references: @{VAR_NAME} or ${VAR_NAME}
    if (source.startsWith('@{') && source.endsWith('}')) {
      const varName = source.slice(2, -1);
      return context.allValues.get(varName) || '';
    }

    if (source.startsWith('${') && source.endsWith('}')) {
      const expression = source.slice(2, -1);
      return this.resolveExpression(expression, context);
    }

    // Direct variable reference
    return context.allValues.get(source) || '';
  }

  public resolvePlaceholders(value: string, context: TransformContext): string {
    return value.replace(/\$\{([^}]+)\}/g, (_match, expression) => {
      return this.resolveExpression(expression, context);
    }).replace(/@\{([^}]+)\}/g, (_match, varName) => {
      return context.allValues.get(varName) || '';
    });
  }

  private resolveExpression(expression: string, context: TransformContext): string {
    // Simple expression resolver (can be extended)
    // Handle format: VAR_NAME:default_value
    const [varName, defaultValue] = expression.split(':');
    return context.allValues.get(varName.trim()) || defaultValue?.trim() || '';
  }

  private extractTransformerParams(options: Record<string, unknown>): Record<string, string> {
    const params: Record<string, string> = {};
    
    // Extract all options except the transformer name itself
    for (const [key, value] of Object.entries(options)) {
      if (key !== 'transformer' && value !== undefined && value !== null) {
        params[key] = String(value);
      }
    }

    return params;
  }

  private registerBuiltInTransformers(): void {
    const defaultPlugins = getDefaultTransformerPlugins();
    
    for (const plugin of defaultPlugins) {
      this.registerTransformer(plugin);
    }

    this.configService.debug(
      `Registered ${defaultPlugins.length} default transformer plugins: ${defaultPlugins.map(p => p.name).join(', ')}`,
      this.serviceName
    );
  }
}
