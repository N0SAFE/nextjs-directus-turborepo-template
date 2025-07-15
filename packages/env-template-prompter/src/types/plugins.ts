import type { TransformContext, FieldOptions } from './index.js';

// Plugin base interface
export interface Plugin {
  name: string;
  description?: string;
}

// Transformer plugin interface
export interface TransformerPlugin extends Plugin {
  transform(
    value: string, 
    params: Record<string, string>, 
    context: TransformContext
  ): string | Promise<string>;
  requiresSource?: boolean;
}

// Validator plugin interface  
export interface ValidatorPlugin {
  name: string;
  description?: string;
  message?: string;
  promptParams?: {
    type?: string;
    message?: string;
    format?: string;
    choices?: Array<{ title: string; value: string }>;
    [key: string]: any;
  };
  validate: (value: string, params?: Record<string, string>) => boolean | Promise<boolean>;
  errorMessage?: (value: string, params?: Record<string, string>) => string;
}

// Prompt plugin interface (for future extensibility)
export interface PromptPlugin extends Plugin {
  prompt(
    message: string,
    options: FieldOptions
  ): Promise<string>;
  supports(type: string): boolean;
}

// Output plugin interface (for future extensibility)
export interface OutputPlugin extends Plugin {
  format(values: Map<string, string>): string;
  extension: string;
  mimeType?: string;
}
