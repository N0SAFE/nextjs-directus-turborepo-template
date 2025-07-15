import type { ValidatorPlugin } from '../../types/index.js';

/**
 * Validator plugins that exactly match the behavior from scripts/init.js
 * These replace the hardcoded validation methods in ValidationService
 */

/**
 * URL validator matching scripts/init.js validateUrl function
 */
export const initJsUrlValidator: ValidatorPlugin = {
  name: 'init_js_url',
  message: 'Invalid URL format',
  promptParams: {
    type: 'text',
    message: 'Enter a valid URL',
    format: 'url',
  },
  validate: (value: string, params: Record<string, string> = {}): boolean => {
    if (!value) {
      return false; // URL is required
    }
    
    try {
      const urlObj = new globalThis.URL(value);
      
      // Check protocol constraints
      if (params.protocol) {
        const allowedProtocols = params.protocol.split(',').map(p => p.trim() + ':');
        if (!allowedProtocols.includes(urlObj.protocol)) {
          return false;
        }
      }
      
      // Check hostname constraints
      if (params.hostname) {
        const allowedHosts = params.hostname.split(',').map(h => h.trim());
        if (!allowedHosts.includes(urlObj.hostname)) {
          return false;
        }
      }
      
      // Check port constraints
      if (params.port && urlObj.port && params.port !== urlObj.port) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false; // Invalid URL format
    }
  },
  errorMessage: (value: string, params: Record<string, string> = {}): string => {
    if (!value) {
      return 'URL is required';
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
      if (params.port && urlObj.port && params.port !== urlObj.port) {
        return `Port must be: ${params.port}`;
      }
      
      return 'Invalid URL format';
    } catch (error) {
      return 'Invalid URL format';
    }
  }
};

/**
 * Number validator matching scripts/init.js validateNumber function
 */
export const initJsNumberValidator: ValidatorPlugin = {
  name: 'init_js_number',
  message: 'Must be a valid number',
  promptParams: {
    type: 'number',
    message: 'Enter a number',
    format: 'number',
  },
  validate: (value: string, params: Record<string, string> = {}): boolean => {
    const num = Number(value);
    
    if (isNaN(num)) {
      return false;
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
      return false;
    }
    
    if (params.max !== undefined && num > Number(params.max)) {
      return false;
    }
    
    return true;
  },
  errorMessage: (value: string, params: Record<string, string> = {}): string => {
    const num = Number(value);
    
    if (isNaN(num)) {
      return 'Must be a valid number';
    }
    
    // Check if the value is in the allowed list (takes precedence over min/max)
    if (params.allow) {
      const allowedValues = params.allow.split(',').map(v => Number(v.trim()));
      if (allowedValues.includes(num)) {
        return 'Must be a valid number'; // This shouldn't happen but fallback
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
    
    return 'Must be a valid number';
  }
};

/**
 * String validator matching scripts/init.js validateString function
 */
export const initJsStringValidator: ValidatorPlugin = {
  name: 'init_js_string',
  message: 'This field is required',
  promptParams: {
    type: 'text',
    message: 'Enter a string value',
    format: 'string',
  },
  validate: (value: string, params: Record<string, string> = {}): boolean => {
    if (!value && params.optional !== 'true') {
      return false; // Field is required
    }
    
    if (value) {
      if (params.minLength && value.length < Number(params.minLength)) {
        return false;
      }
      
      if (params.maxLength && value.length > Number(params.maxLength)) {
        return false;
      }
      
      if (params.pattern) {
        const regex = new RegExp(params.pattern);
        if (!regex.test(value)) {
          return false;
        }
      }
    }
    
    return true;
  },
  errorMessage: (value: string, params: Record<string, string> = {}): string => {
    if (!value && params.optional !== 'true') {
      return 'This field is required';
    }
    
    if (value) {
      if (params.minLength && value.length < Number(params.minLength)) {
        return `Must be at least ${params.minLength} characters`;
      }
      
      if (params.maxLength && value.length > Number(params.maxLength)) {
        return `Must be at most ${params.maxLength} characters`;
      }
      
      if (params.pattern) {
        const regex = new RegExp(params.pattern);
        if (!regex.test(value)) {
          return `Must match pattern: ${params.pattern}`;
        }
      }
    }
    
    return 'This field is required';
  }
};

/**
 * Date validator matching scripts/init.js validateDate function
 */
export const initJsDateValidator: ValidatorPlugin = {
  name: 'init_js_date',
  message: 'Invalid date format',
  promptParams: {
    type: 'date',
    message: 'Enter a valid date',
    format: 'date',
  },
  validate: (value: string, params: Record<string, string> = {}): boolean => {
    if (!value && params.optional === 'true') {
      return true;
    }
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return false;
    }
    
    if (params.minDate && date < new Date(params.minDate)) {
      return false;
    }
    
    if (params.maxDate && date > new Date(params.maxDate)) {
      return false;
    }
    
    return true;
  },
  errorMessage: (value: string, params: Record<string, string> = {}): string => {
    if (!value && params.optional === 'true') {
      return 'Invalid date format'; // This shouldn't happen but fallback
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
    
    return 'Invalid date format';
  }
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