/**
 * Extracts protocol from URL
 */
export const extractProtocolTransformer: TransformerPlugin = {
  name: 'extract_protocol',
  description: 'Extracts protocol from URL',
  requiresSource: true,
  transform: (value: string, _params: Record<string, string>, context: TransformContext): string => {
    const { sourceValue } = context;
    const urlToExtract = sourceValue || value;
    if (!urlToExtract) {
      return '';
    }
    try {
      const url = new URL(urlToExtract);
      // Remove trailing colon from protocol
      return url.protocol.replace(':', '');
    } catch {
      return '';
    }
  }
};
import { randomBytes } from 'crypto';
import { URL } from 'url';
import type { TransformerPlugin, TransformContext } from '../../types/index.js';

/**
 * Default Transformer Plugins
 * 
 * These are the built-in transformers that were previously embedded in TransformerService.
 * They are now modularized as plugins for better testability and extensibility.
 */

/**
 * Extracts port number from URL
 */
export const extractPortTransformer: TransformerPlugin = {
  name: 'extract_port',
  description: 'Extracts port number from URL',
  requiresSource: true,
  transform: (value: string, _params: Record<string, string>, context: TransformContext): string => {
    const { sourceValue } = context;
    const urlToExtract = sourceValue || value;
    
    if (!urlToExtract) {
      return value || '3000'; // Default port
    }

    try {
      const url = new URL(urlToExtract);
      const { port } = url;
      
      if (port) {
        return port;
      }
      
      // Default ports for protocols
      switch (url.protocol) {
        case 'https:':
          return '443';
        case 'http:':
          return '80';
        case 'postgres:':
        case 'postgresql:':
          return '5432';
        case 'mysql:':
          return '3306';
        case 'redis:':
          return '6379';
        default:
          return value || '3000';
      }
    } catch {
      return value || '3000';
    }
  }
};

/**
 * Extracts hostname from URL
 */
export const extractHostnameTransformer: TransformerPlugin = {
  name: 'extract_hostname',
  description: 'Extracts hostname from URL',
  requiresSource: true,
  transform: (value: string, _params: Record<string, string>, context: TransformContext): string => {
    const { sourceValue } = context;
    const urlToExtract = sourceValue || value;
    
    if (!urlToExtract) {
      return value || 'localhost';
    }

    try {
      const url = new URL(urlToExtract);
      return url.hostname || value || 'localhost';
    } catch {
      return value || 'localhost';
    }
  }
};

/**
 * Builds CORS origins list from existing URLs
 */
export const corsOriginsTransformer: TransformerPlugin = {
  name: 'cors_origins',
  description: 'Builds CORS origins list from existing URLs',
  requiresSource: false,
  transform: (value: string, _params: Record<string, string>, context: TransformContext): string => {
    const origins = new Set<string>();

    // Helper function to validate URL
    const isValidUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    // Helper function to find URL field name for origin
    const findUrlFieldForOrigin = (origin: string): string | null => {
      for (const [key, fieldValue] of context.allValues) {
        if (isValidUrl(fieldValue)) {
          try {
            const url = new URL(fieldValue);
            const urlOrigin = `${url.protocol}//${url.host}`;
            if (urlOrigin === origin) {
              return key
                .toLowerCase()
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            }
          } catch {
            // Ignore invalid URLs
          }
        }
      }
      return null;
    };

    // Collect URLs from all values
    for (const [_key, val] of context.allValues) {
      if (isValidUrl(val)) {
        try {
          const url = new URL(val);
          const origin = `${url.protocol}//${url.host}`;
          origins.add(origin);
        } catch {
          // Ignore invalid URLs
        }
      }
    }

    const originsList = Array.from(origins);
    
    // Format as description list
    if (originsList.length === 0) {
      return value || '';
    }

    return originsList.map((origin, index) => {
      const urlField = findUrlFieldForOrigin(origin);
      const description = urlField ? `(${urlField})` : `(URL ${index + 1})`;
      return `${description} => ${origin}`;
    }).join('\n');
  }
};

/**
 * Generates cryptographic secrets
 */
export const generateSecretTransformer: TransformerPlugin = {
  name: 'generate_secret',
  description: 'Generates random cryptographic secret',
  requiresSource: false,
  transform: (value: string, params: Record<string, string>): string => {
    if (value && value.length >= 32) {
      return value; // Keep existing valid secret
    }

    const length = parseInt(params.length || '32', 10);
    return randomBytes(Math.ceil(length / 2)).toString('hex').substring(0, length);
  }
};

/**
 * Converts value to boolean flag
 */
export const booleanFlagTransformer: TransformerPlugin = {
  name: 'boolean_flag',
  description: 'Converts value to boolean flag (true/false)',
  requiresSource: false,
  transform: (value: string): string => {
    if (!value) {
      return 'false';
    }

    const normalized = value.toLowerCase().trim();
    const truthyValues = ['true', 'yes', '1', 'on', 'enabled'];
    return truthyValues.includes(normalized) ? 'true' : 'false';
  }
};

/**
 * Converts CSV string to array format
 */
export const arrayFromCsvTransformer: TransformerPlugin = {
  name: 'array_from_csv',
  description: 'Converts CSV string to array format',
  requiresSource: false,
  transform: (value: string, params: Record<string, string>): string => {
    if (!value) {
      return '[]';
    }

    const separator = params.separator || ',';
    const items = value.split(separator).map(item => item.trim()).filter(Boolean);
    
    const format = params.format || 'json';
    switch (format) {
      case 'json':
        return JSON.stringify(items);
      case 'env':
        return items.join(',');
      default:
        return items.join(separator);
    }
  }
};

/**
 * Collection of all default transformer plugins
 */
export const defaultTransformerPlugins: TransformerPlugin[] = [
  extractPortTransformer,
  extractHostnameTransformer,
  extractProtocolTransformer,
  corsOriginsTransformer,
  generateSecretTransformer,
  booleanFlagTransformer,
  arrayFromCsvTransformer
];

/**
 * Default transformer plugin registry helper
 */
export const getDefaultTransformerPlugins = (): TransformerPlugin[] => {
  return [...defaultTransformerPlugins];
};
