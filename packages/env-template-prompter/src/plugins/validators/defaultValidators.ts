import { URL } from 'url';
import type { ValidatorPlugin } from '../../types/index.js';

/**
 * Default Validator Plugins
 * 
 * These are the built-in validators that were previously embedded in ValidationService.
 * They are now modularized as plugins for better testability and extensibility.
 */

/**
 * Validates URL format
 */
export const urlValidator: ValidatorPlugin = {
  name: 'url',
  message: 'Invalid URL format',
  promptParams: {
    type: 'text',
    message: 'Enter a valid URL (e.g., https://example.com)',
    format: 'url',
  },
  validate: (value: string): boolean => {
    if (!value || !value.trim()) {
      return false;
    }

    try {
      const url = new URL(value);
      // Ensure it has a valid protocol
      return ['http:', 'https:', 'ftp:', 'ftps:', 'postgres:', 'postgresql:', 'mysql:', 'redis:'].includes(url.protocol);
    } catch {
      return false;
    }
  }
};

/**
 * Validates numeric values with constraints
 */
export const numberValidator: ValidatorPlugin = {
  name: 'number',
  message: 'Invalid number',
  promptParams: {
    type: 'number',
    message: 'Enter a number',
    format: 'number',
  },
  validate: (value: string, params: Record<string, string>): boolean => {
    if (!value || !value.trim()) {
      return false;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      return false;
    }

    // Check allow list first (takes precedence)
    if (params.allow) {
      const allowedValues = params.allow.split(',').map(v => parseFloat(v.trim()));
      if (allowedValues.includes(num)) {
        return true;
      }
    }

    // Check min/max constraints
    if (params.min !== undefined) {
      const min = parseFloat(params.min);
      if (!isNaN(min) && num < min) {
        return false;
      }
    }

    if (params.max !== undefined) {
      const max = parseFloat(params.max);
      if (!isNaN(max) && num > max) {
        return false;
      }
    }

    return true;
  }
};

/**
 * Validates string values with length constraints
 */
export const stringValidator: ValidatorPlugin = {
  name: 'string',
  message: 'Invalid string',
  promptParams: {
    type: 'text',
    message: 'Enter a string value',
    format: 'string',
  },
  validate: (value: string, params: Record<string, string>): boolean => {
    if (params.required === 'false' && (!value || !value.trim())) {
      return true; // Allow empty for optional fields
    }

    if (!value) {
      return false;
    }

    // Check minimum length
    if (params.min_length !== undefined) {
      const minLength = parseInt(params.min_length, 10);
      if (!isNaN(minLength) && value.length < minLength) {
        return false;
      }
    }

    // Check maximum length
    if (params.max_length !== undefined) {
      const maxLength = parseInt(params.max_length, 10);
      if (!isNaN(maxLength) && value.length > maxLength) {
        return false;
      }
    }

    // Check pattern if provided
    if (params.pattern) {
      try {
        const regex = new RegExp(params.pattern);
        return regex.test(value);
      } catch {
        return false; // Invalid regex pattern
      }
    }

    return true;
  }
};

/**
 * Validates boolean values
 */
export const booleanValidator: ValidatorPlugin = {
  name: 'boolean',
  message: 'Invalid boolean value',
  promptParams: {
    type: 'confirm',
    message: 'Select true or false',
    choices: [
      { title: 'True', value: 'true' },
      { title: 'False', value: 'false' },
      { title: 'Yes', value: 'yes' },
      { title: 'No', value: 'no' },
      { title: 'Enabled', value: 'enabled' },
      { title: 'Disabled', value: 'disabled' }
    ],
    format: 'boolean',
  },
  validate: (value: string): boolean => {
    if (!value || !value.trim()) {
      return false;
    }

    const normalized = value.toLowerCase().trim();
    const validValues = ['true', 'false', 'yes', 'no', '1', '0', 'on', 'off', 'enabled', 'disabled'];
    return validValues.includes(normalized);
  }
};

/**
 * Validates email addresses
 */
export const emailValidator: ValidatorPlugin = {
  name: 'email',
  message: 'Invalid email address',
  promptParams: {
    type: 'text',
    message: 'Enter a valid email address',
    format: 'email',
  },
  validate: (value: string): boolean => {
    if (!value || !value.trim()) {
      return false;
    }

    // Basic email regex - not perfect but good enough for most cases
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  }
};

/**
 * Validates port numbers
 */
export const portValidator: ValidatorPlugin = {
  name: 'port',
  message: 'Invalid port number (1-65535)',
  promptParams: {
    type: 'number',
    message: 'Enter a port number (1-65535)',
    format: 'port',
  },
  validate: (value: string, params: Record<string, string>): boolean => {
    if (!value || !value.trim()) {
      return false;
    }

    const port = parseInt(value, 10);
    if (isNaN(port)) {
      return false;
    }

    // Check allow list first
    if (params.allow) {
      const allowedPorts = params.allow.split(',').map(p => parseInt(p.trim(), 10));
      if (allowedPorts.includes(port)) {
        return true;
      }
    }

    // Standard port range
    return port >= 1 && port <= 65535;
  }
};

/**
 * Validates JSON strings
 */
export const jsonValidator: ValidatorPlugin = {
  name: 'json',
  message: 'Invalid JSON format',
  promptParams: {
    type: 'text',
    message: 'Enter a valid JSON string',
    format: 'json',
  },
  validate: (value: string): boolean => {
    if (!value || !value.trim()) {
      return false;
    }

    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Validates file paths
 */
export const pathValidator: ValidatorPlugin = {
  name: 'path',
  message: 'Invalid file path',
  promptParams: {
    type: 'text',
    message: 'Enter a valid file path',
    format: 'path',
  },
  validate: (value: string, params: Record<string, string>): boolean => {
    if (!value || !value.trim()) {
      return false;
    }

    // Basic path validation - avoid dangerous characters
    const dangerousChars = /[<>"|?*]/;
    if (dangerousChars.test(value)) {
      return false;
    }

    // Check if it should be absolute
    if (params.absolute === 'true') {
      // Very basic absolute path check (works for most cases)
      return /^([a-zA-Z]:|\\\\|\/)/.test(value);
    }

    return true;
  }
};


/**
 * Validates select field values
 */
export const selectValidator: ValidatorPlugin = {
  name: 'select',
  message: 'Invalid selection',
  promptParams: {
    type: 'select',
    message: 'Select one option',
    choices: [], // Will be filled dynamically from params.options
    format: 'select',
  },
  validate: (value: string, params: Record<string, string | string[]>): boolean => {
    if (!value || !value.trim()) {
      return false;
    }
    if (Array.isArray(params.options)) {
      return params.options.includes(value);
    } else if (typeof params.options === 'string') {
      return params.options.split(',').map(v => v.trim()).includes(value);
    }
    return true;
  }
};

/**
 * Validates multi-select field values
 */
export const multiSelectValidator: ValidatorPlugin = {
  name: 'multiselect',
  message: 'Invalid multi-selection',
  promptParams: {
    type: 'multiselect',
    message: 'Select one or more options',
    choices: [], // Will be filled dynamically from params.options
    format: 'multiselect',
  },
  validate: (value: string | string[], params: Record<string, string | string[]>): boolean => {
    const values = Array.isArray(value) ? value : value.split(',').map(v => v.trim());
    if (!values.length) {
      return false;
    }
    let options: string[] = [];
    if (Array.isArray(params.options)) {
      options = params.options;
    } else if (typeof params.options === 'string') {
      options = params.options.split(',').map(v => v.trim());
    }
    return values.every(v => options.includes(v));
  }
};

/**
 * Validates date field values
 */
export const dateValidator: ValidatorPlugin = {
  name: 'date',
  message: 'Invalid date format',
  promptParams: {
    type: 'date',
    message: 'Enter a valid date',
    format: 'date',
  },
  validate: (value: string, params: Record<string, string>): boolean => {
    if (!value || !value.trim()) {
      return false;
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
  }
};

/**
 * Collection of all default validator plugins
 */
export const defaultValidatorPlugins: ValidatorPlugin[] = [
  urlValidator,
  numberValidator,
  stringValidator,
  booleanValidator,
  emailValidator,
  portValidator,
  jsonValidator,
  pathValidator,
  selectValidator,
  multiSelectValidator,
  dateValidator
];

/**
 * Default validator plugin registry helper
 */
export const getDefaultValidatorPlugins = (): ValidatorPlugin[] => {
  return [...defaultValidatorPlugins];
};
