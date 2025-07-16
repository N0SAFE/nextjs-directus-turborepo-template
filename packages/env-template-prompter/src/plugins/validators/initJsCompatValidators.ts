import type { ValidatorPlugin, ServiceContainer, TemplateField } from '../../types/index.js';

/**
 * Validator plugins that exactly match the behavior from scripts/init.js
 * These replace the hardcoded validation methods in ValidationService
 */

/**
 * URL validator matching scripts/init.js validateUrl function
 */
export const initJsUrlValidator: ValidatorPlugin = {
  name: 'init_js_url',
  description: 'Validates URLs with protocol, hostname, and port constraints',
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (value: string, params: Record<string, string> = {}) => {
      if (!value) {
        return 'URL is required'; // URL is required
      }
      
      try {
        const urlObj = new globalThis.URL(value);
        
        // Check protocol constraints
        if (params.protocol) {
          const allowedProtocols = params.protocol.split(',').map(p => p.trim() + ':');
          if (!allowedProtocols.includes(urlObj.protocol)) {
            return `Protocol must be one of: ${params.protocol}`;
          }
        }
        
        // Check hostname constraints
        if (params.hostname) {
          const allowedHosts = params.hostname.split(',').map(h => h.trim());
          if (!allowedHosts.includes(urlObj.hostname)) {
            return `Hostname must be one of: ${params.hostname}`;
          }
        }
        
        // Check port constraints
        if (params.port && urlObj.port) {
          const allowedPorts = params.port.split(',').map(p => p.trim());
          if (!allowedPorts.includes(urlObj.port)) {
            return `Port must be one of: ${params.port}`;
          }
        }
        
        return true;
      } catch (error) {
        return 'Invalid URL format'; // Invalid URL format
      }
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: 'text',
      message: promptOptions.message || 'Enter a valid URL'
    })
  })
};
/**
 * Number validator matching scripts/init.js validateNumber function
 */
export const initJsNumberValidator: ValidatorPlugin = {
  name: 'init_js_number',
  description: 'Validates numbers with min/max constraints and optional allowed values',
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (value: string, params: Record<string, string> = {}) => {
      // Empty string should be invalid for numbers
      if (!value || value.trim() === '') {
        return 'Must be a valid number';
      }
      
      const num = Number(value);
      
      if (isNaN(num) || !isFinite(num)) {
        return 'Must be a valid number';
      }
      
      // Check if the value is in the allowed list (takes precedence over min/max)
      if (params.allow) {
        const allowedValues = params.allow.split(',').map(v => Number(v.trim()));
        if (allowedValues.includes(num)) {
          return true; // Value is explicitly allowed
        }
      }
      
      // Check min/max constraints
      if (params.min !== undefined && num < Number(params.min)) {
        const allowedText = params.allow ? ` or one of: ${params.allow}` : '';
        return `Must be at least ${params.min}${allowedText}`;
      }
      
      if (params.max !== undefined && num > Number(params.max)) {
        const allowedText = params.allow ? ` or one of: ${params.allow}` : '';
        return `Must be at most ${params.max}${allowedText}`;
      }
      
      return true;
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: 'number',
      message: promptOptions.message || 'Enter a number'
    })
  })
};

/**
 * String validator matching scripts/init.js validateString function
 */
export const initJsStringValidator: ValidatorPlugin = {
  name: 'init_js_string',
  description: 'Validates strings with optional constraints like min/max length, pattern, and required status',
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (value: string, params: Record<string, string> = {}) => {
      if (!value && params.optional === 'false') {
        return 'This field is required'; // Field is required
      }
      
      if (value) {
        const minLength = params.minLength || params.min_length;
        const maxLength = params.maxLength || params.max_length;
        
        if (minLength && value.length < Number(minLength)) {
          return `Must be at least ${minLength} characters`;
        }
        
        if (maxLength && value.length > Number(maxLength)) {
          return `Must be at most ${maxLength} characters`;
        }
        
        if (params.pattern) {
          const regex = new RegExp(params.pattern);
          if (!regex.test(value)) {
            return `Must match pattern: ${params.pattern}`;
          }
        }
      }
      
      return true;
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: 'text',
      message: promptOptions.message || 'Enter a string value'
    })
  })
};

/**
 * Date validator matching scripts/init.js validateDate function
 */
export const initJsDateValidator: ValidatorPlugin = {
  name: 'init_js_date',
  description: 'Validates dates with optional min/max date constraints',
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (value: string, params: Record<string, string> = {}) => {
      if (!value && params.optional === 'true') {
        return true;
      }
      
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Invalid date format';
      }
      
      if (params.minDate && date < new Date(params.minDate)) {
        return `Date must be after ${params.minDate}`;
      }
      
      if (params.maxDate && date > new Date(params.maxDate)) {
        return `Date must be before ${params.maxDate}`;
      }
      
      return true;
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: 'date',
      message: promptOptions.message || 'Enter a valid date'
    })
  })
};

/**
 * Collection of all init.js compatible validator plugins
 */
export const initJsCompatValidatorPlugins: ValidatorPlugin[] = [
  initJsUrlValidator,
  initJsNumberValidator,
  initJsStringValidator,
  initJsDateValidator
];

/**
 * Helper to get all init.js compatible validator plugins
 */
export const getInitJsCompatValidatorPlugins = (): ValidatorPlugin[] => {
  return [...initJsCompatValidatorPlugins];
};