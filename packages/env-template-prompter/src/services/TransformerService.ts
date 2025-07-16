import type {
  TemplateField,
  TransformContext,
  TransformerPlugin
} from '../types/index.js';
import type { ITransformerService, IConfigService, IValidationService } from '../types/services.js';
import { getDefaultTransformerPlugins } from '../plugins/transformers/defaultTransformers.js';

export class TransformerService implements ITransformerService {
  public readonly serviceName = 'TransformerService';
  
  private transformers = new Map<string, TransformerPlugin>();
  private validationService?: IValidationService;

  constructor(
    private configService: IConfigService
  ) {
    this.registerBuiltInTransformers();
  }

  /**
   * Set the validation service for variable validation
   */
  public setValidationService(validationService: IValidationService): void {
    this.validationService = validationService;
  }

  public async applyTransformers(field: TemplateField, context: TransformContext): Promise<string> {
    this.configService.debug(`Applying transformers for field: ${field.key}`, this.serviceName);

    if (!field.options.transformer) {
      this.configService.debug(`No transformer specified for ${field.key}`, this.serviceName);
      return context.sourceValue;
    }

    // Only apply transformers to variable values, not direct user input
    if (!context.isVariableValue && !field.options.source) {
      this.configService.debug(
        `Skipping transformer for ${field.key}: not a variable value and no source specified`,
        this.serviceName
      );
      return context.sourceValue;
    }

    const transformerName = String(field.options.transformer);
    const params = this.extractTransformerParams(field.options);

    try {
      const result = await this.transformValue(context.sourceValue, transformerName, params, context);
      this.configService.debug(
        `Transformer ${transformerName} for ${field.key}: "${context.sourceValue}" -> "${result}" (variable: ${!!context.isVariableValue})`,
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

  public async resolveSourceValue(field: TemplateField, context: TransformContext): Promise<string> {
    if (!field.options.source) {
      return '';
    }

    const source = String(field.options.source);
    let variableName: string;
    let rawValue: string;
    
    // Handle variable references: @{VAR_NAME} or ${VAR_NAME}
    if (source.startsWith('@{') && source.endsWith('}')) {
      variableName = source.slice(2, -1);
      rawValue = context.allValues.get(variableName) || '';
    } else if (source.startsWith('${') && source.endsWith('}')) {
      const expression = source.slice(2, -1);
      const resolved = this.resolveExpression(expression, context);
      // Extract variable name for validation
      const [varName] = expression.split(':');
      variableName = varName.trim();
      rawValue = resolved;
    } else {
      // Direct variable reference
      variableName = source;
      rawValue = context.allValues.get(source) || '';
    }

    // If no value found, return empty
    if (!rawValue) {
      return '';
    }

    // Validate and potentially transform the variable value
    if (this.validationService && variableName) {
      // Find the source field in template fields for validation
      const sourceField = context.templateFields.find(f => f.key === variableName);
      if (sourceField) {
        try {
          const validationResult = await this.validationService.validateVariable(
            variableName,
            rawValue,
            sourceField,
            context
          );

          if (!validationResult.valid) {
            this.configService.debug(
              `Variable validation failed for ${variableName}: ${validationResult.errors.join(', ')}`,
              this.serviceName
            );
            // Return raw value but log warnings
            for (const error of validationResult.errors) {
              console.warn(`Warning: ${error}`);
            }
          }

          return validationResult.value; // Use validated/transformed value
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown validation error';
          this.configService.debug(`Variable validation error for ${variableName}: ${message}`, this.serviceName);
        }
      }
    }

    return rawValue;
  }

  public async resolvePlaceholders(value: string, context: TransformContext): Promise<string> {
    // First handle ${} expressions
    let result = value;
    const dollarExpressions = value.match(/\$\{([^}]+)\}/g);
    if (dollarExpressions) {
      for (const match of dollarExpressions) {
        const expression = match.slice(2, -1); // Remove ${ and }
        const resolved = this.resolveExpression(expression, context);
        result = result.replace(match, resolved);
      }
    }

    // Then handle @{} variable references with validation
    const atExpressions = result.match(/@\{([^}]+)\}/g);
    if (atExpressions) {
      for (const match of atExpressions) {
        const variableName = match.slice(2, -1); // Remove @{ and }
        let variableValue = context.allValues.get(variableName) || '';

        // Validate variable if validation service is available
        if (this.validationService && variableValue && variableName) {
          const sourceField = context.templateFields.find(f => f.key === variableName);
          if (sourceField) {
            try {
              const validationResult = await this.validationService.validateVariable(
                variableName,
                variableValue,
                sourceField,
                context
              );

              if (!validationResult.valid) {
                this.configService.debug(
                  `Variable validation failed for ${variableName} in placeholder: ${validationResult.errors.join(', ')}`,
                  this.serviceName
                );
                // Use original value but log warnings
                for (const error of validationResult.errors) {
                  console.warn(`Warning: ${error}`);
                }
              }

              variableValue = validationResult.value; // Use validated/transformed value
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Unknown validation error';
              this.configService.debug(`Variable validation error for ${variableName}: ${message}`, this.serviceName);
            }
          }
        }

        result = result.replace(match, variableValue);
      }
    }

    return result;
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
