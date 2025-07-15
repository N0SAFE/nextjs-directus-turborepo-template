import { describe, it, expect, beforeEach } from 'vitest';
import { 
  initJsUrlValidator,
  initJsNumberValidator, 
  initJsStringValidator,
  initJsDateValidator,
  getInitJsCompatValidatorPlugins
} from '../../src/plugins/validators/initJsCompatValidators.js';

describe('Init.js Validator Plugins - 100% Coverage', () => {
  describe('getInitJsCompatValidatorPlugins', () => {
    it('should return all init.js compatible validators', () => {
      const plugins = getInitJsCompatValidatorPlugins();
      expect(plugins).toHaveLength(4);
      expect(plugins.map(p => p.name)).toEqual([
        'init_js_url',
        'init_js_number', 
        'init_js_string',
        'init_js_date'
      ]);
    });
  });

  describe('initJsUrlValidator - Complete Coverage', () => {
    it('should have correct plugin metadata', () => {
      expect(initJsUrlValidator.name).toBe('init_js_url');
      expect(initJsUrlValidator.message).toBe('Invalid URL format');
      expect(initJsUrlValidator.promptParams).toBeDefined();
      expect(initJsUrlValidator.promptParams!.type).toBe('text');
    });

    it('should validate basic URLs', async () => {
      expect(await initJsUrlValidator.validate('https://example.com')).toBe(true);
      expect(await initJsUrlValidator.validate('http://localhost')).toBe(true);
      expect(await initJsUrlValidator.validate('ftp://ftp.example.com')).toBe(true);
      expect(await initJsUrlValidator.validate('postgres://db.example.com')).toBe(true);
    });

    it('should reject empty and invalid URLs', async () => {
      expect(await initJsUrlValidator.validate('')).toBe(false);
      expect(await initJsUrlValidator.validate('not-a-url')).toBe(false);
      expect(await initJsUrlValidator.validate('http://')).toBe(false);
      expect(await initJsUrlValidator.validate('://example.com')).toBe(false);
    });

    it('should validate protocol constraints', async () => {
      expect(await initJsUrlValidator.validate('https://example.com', { protocol: 'https' })).toBe(true);
      expect(await initJsUrlValidator.validate('https://example.com', { protocol: 'https,http' })).toBe(true);
      expect(await initJsUrlValidator.validate('http://example.com', { protocol: 'https' })).toBe(false);
      expect(await initJsUrlValidator.validate('ftp://example.com', { protocol: 'https,http' })).toBe(false);
    });

    it('should validate hostname constraints', async () => {
      expect(await initJsUrlValidator.validate('https://example.com', { hostname: 'example.com' })).toBe(true);
      expect(await initJsUrlValidator.validate('https://localhost', { hostname: 'localhost,example.com' })).toBe(true);
      expect(await initJsUrlValidator.validate('https://other.com', { hostname: 'example.com' })).toBe(false);
      expect(await initJsUrlValidator.validate('https://sub.example.com', { hostname: 'example.com' })).toBe(false);
    });

    it('should validate port constraints', async () => {
      expect(await initJsUrlValidator.validate('https://example.com:3000', { port: '3000' })).toBe(true);
      expect(await initJsUrlValidator.validate('https://example.com:8080', { port: '3000' })).toBe(false);
      expect(await initJsUrlValidator.validate('https://example.com', { port: '3000' })).toBe(true); // No port specified, passes
    });

    it('should provide correct error messages for all cases', () => {
      expect(initJsUrlValidator.errorMessage!('')).toBe('URL is required');
      expect(initJsUrlValidator.errorMessage!('not-a-url')).toBe('Invalid URL format');
      expect(initJsUrlValidator.errorMessage!('http://example.com', { protocol: 'https' })).toBe('Protocol must be one of: https');
      expect(initJsUrlValidator.errorMessage!('https://other.com', { hostname: 'example.com' })).toBe('Hostname must be one of: example.com');
      expect(initJsUrlValidator.errorMessage!('https://example.com:8080', { port: '3000' })).toBe('Port must be: 3000');
      expect(initJsUrlValidator.errorMessage!('https://example.com')).toBe('Invalid URL format'); // Valid URL returns fallback
    });

    it('should handle complex URLs with multiple constraints', async () => {
      const params = { protocol: 'https', hostname: 'api.example.com', port: '8080' };
      expect(await initJsUrlValidator.validate('https://api.example.com:8080', params)).toBe(true);
      expect(await initJsUrlValidator.validate('http://api.example.com:8080', params)).toBe(false);
      expect(await initJsUrlValidator.validate('https://other.example.com:8080', params)).toBe(false);
      expect(await initJsUrlValidator.validate('https://api.example.com:3000', params)).toBe(false);
    });
  });

  describe('initJsNumberValidator - Complete Coverage', () => {
    it('should have correct plugin metadata', () => {
      expect(initJsNumberValidator.name).toBe('init_js_number');
      expect(initJsNumberValidator.message).toBe('Must be a valid number');
      expect(initJsNumberValidator.promptParams).toBeDefined();
    });

    it('should validate various number formats', async () => {
      expect(await initJsNumberValidator.validate('42')).toBe(true);
      expect(await initJsNumberValidator.validate('0')).toBe(true);
      expect(await initJsNumberValidator.validate('-123')).toBe(true);
      expect(await initJsNumberValidator.validate('3.14159')).toBe(true);
      expect(await initJsNumberValidator.validate('-2.718')).toBe(true);
      expect(await initJsNumberValidator.validate('1e10')).toBe(true);
      expect(await initJsNumberValidator.validate('1.5e-10')).toBe(true);
    });

    it('should reject invalid numbers', async () => {
      expect(await initJsNumberValidator.validate('not-a-number')).toBe(false);
      expect(await initJsNumberValidator.validate('')).toBe(false);
      expect(await initJsNumberValidator.validate('12abc')).toBe(false);
      expect(await initJsNumberValidator.validate('12.34.56')).toBe(false);
      expect(await initJsNumberValidator.validate('Infinity')).toBe(false);
      expect(await initJsNumberValidator.validate('NaN')).toBe(false);
    });

    it('should validate allow list with precedence over min/max', async () => {
      const params = { allow: '80,443,8080', min: '1000', max: '9000' };
      expect(await initJsNumberValidator.validate('80', params)).toBe(true);  // In allow list
      expect(await initJsNumberValidator.validate('443', params)).toBe(true); // In allow list  
      expect(await initJsNumberValidator.validate('8080', params)).toBe(true); // In allow list
      expect(await initJsNumberValidator.validate('1500', params)).toBe(true); // In range
      expect(await initJsNumberValidator.validate('500', params)).toBe(false); // Not in allow list and below min
      expect(await initJsNumberValidator.validate('9500', params)).toBe(false); // Not in allow list and above max
    });

    it('should validate min constraints', async () => {
      expect(await initJsNumberValidator.validate('15', { min: '10' })).toBe(true);
      expect(await initJsNumberValidator.validate('10', { min: '10' })).toBe(true);
      expect(await initJsNumberValidator.validate('5', { min: '10' })).toBe(false);
      expect(await initJsNumberValidator.validate('-5', { min: '0' })).toBe(false);
    });

    it('should validate max constraints', async () => {
      expect(await initJsNumberValidator.validate('50', { max: '100' })).toBe(true);
      expect(await initJsNumberValidator.validate('100', { max: '100' })).toBe(true);
      expect(await initJsNumberValidator.validate('150', { max: '100' })).toBe(false);
    });

    it('should validate both min and max constraints', async () => {
      const params = { min: '10', max: '100' };
      expect(await initJsNumberValidator.validate('50', params)).toBe(true);
      expect(await initJsNumberValidator.validate('10', params)).toBe(true);
      expect(await initJsNumberValidator.validate('100', params)).toBe(true);
      expect(await initJsNumberValidator.validate('5', params)).toBe(false);
      expect(await initJsNumberValidator.validate('150', params)).toBe(false);
    });

    it('should provide correct error messages for all cases', () => {
      expect(initJsNumberValidator.errorMessage!('not-a-number')).toBe('Must be a valid number');
      expect(initJsNumberValidator.errorMessage!('5', { min: '10' })).toBe('Must be at least 10');
      expect(initJsNumberValidator.errorMessage!('150', { max: '100' })).toBe('Must be at most 100');
      expect(initJsNumberValidator.errorMessage!('5', { min: '10', allow: '80,443' })).toBe('Must be at least 10 or one of: 80,443');
      expect(initJsNumberValidator.errorMessage!('150', { max: '100', allow: '80,443' })).toBe('Must be at most 100 or one of: 80,443');
      expect(initJsNumberValidator.errorMessage!('42')).toBe('Must be a valid number'); // Valid fallback
    });

    it('should handle decimal values in allow list', async () => {
      const params = { allow: '3.14,2.718,1.414' };
      expect(await initJsNumberValidator.validate('3.14', params)).toBe(true);
      expect(await initJsNumberValidator.validate('2.718', params)).toBe(true);
      expect(await initJsNumberValidator.validate('1.5', params)).toBe(false);
    });
  });

  describe('initJsStringValidator - Complete Coverage', () => {
    it('should have correct plugin metadata', () => {
      expect(initJsStringValidator.name).toBe('init_js_string');
      expect(initJsStringValidator.message).toBe('This field is required');
      expect(initJsStringValidator.promptParams).toBeDefined();
    });

    it('should validate required vs optional fields', async () => {
      expect(await initJsStringValidator.validate('hello')).toBe(true);
      expect(await initJsStringValidator.validate('')).toBe(false); // Required by default
      expect(await initJsStringValidator.validate('', { optional: 'true' })).toBe(true);
      expect(await initJsStringValidator.validate('', { optional: 'false' })).toBe(false);
      expect(await initJsStringValidator.validate('hello', { optional: 'true' })).toBe(true);
    });

    it('should validate minLength constraints', async () => {
      expect(await initJsStringValidator.validate('hello', { minLength: '3' })).toBe(true);
      expect(await initJsStringValidator.validate('hello', { minLength: '5' })).toBe(true);
      expect(await initJsStringValidator.validate('hi', { minLength: '3' })).toBe(false);
      expect(await initJsStringValidator.validate('', { minLength: '1' })).toBe(false);
      expect(await initJsStringValidator.validate('a', { minLength: '1' })).toBe(true);
    });

    it('should validate maxLength constraints', async () => {
      expect(await initJsStringValidator.validate('hello', { maxLength: '10' })).toBe(true);
      expect(await initJsStringValidator.validate('hello', { maxLength: '5' })).toBe(true);
      expect(await initJsStringValidator.validate('hello world', { maxLength: '5' })).toBe(false);
      expect(await initJsStringValidator.validate('', { maxLength: '5' })).toBe(false); // Still required
    });

    it('should validate both min and max length', async () => {
      const params = { minLength: '3', maxLength: '10' };
      expect(await initJsStringValidator.validate('hello', params)).toBe(true);
      expect(await initJsStringValidator.validate('hi', params)).toBe(false);
      expect(await initJsStringValidator.validate('this is too long', params)).toBe(false);
    });

    it('should validate pattern constraints', async () => {
      expect(await initJsStringValidator.validate('hello', { pattern: '^[a-z]+$' })).toBe(true);
      expect(await initJsStringValidator.validate('Hello', { pattern: '^[a-z]+$' })).toBe(false);
      expect(await initJsStringValidator.validate('hello123', { pattern: '^[a-z]+$' })).toBe(false);
      expect(await initJsStringValidator.validate('123', { pattern: '\\d+' })).toBe(true);
      expect(await initJsStringValidator.validate('abc', { pattern: '\\d+' })).toBe(false);
    });

    it('should validate complex combinations', async () => {
      const params = { minLength: '3', maxLength: '10', pattern: '^[a-z]+$', optional: 'false' };
      expect(await initJsStringValidator.validate('hello', params)).toBe(true);
      expect(await initJsStringValidator.validate('hi', params)).toBe(false); // Too short
      expect(await initJsStringValidator.validate('Hello', params)).toBe(false); // Pattern fail
      expect(await initJsStringValidator.validate('verylongstring', params)).toBe(false); // Too long
      expect(await initJsStringValidator.validate('', params)).toBe(false); // Required
    });

    it('should provide correct error messages for all cases', () => {
      expect(initJsStringValidator.errorMessage!('')).toBe('This field is required');
      expect(initJsStringValidator.errorMessage!('', { optional: 'true' })).toBe('This field is required'); // Fallback
      expect(initJsStringValidator.errorMessage!('hi', { minLength: '3' })).toBe('Must be at least 3 characters');
      expect(initJsStringValidator.errorMessage!('toolongstring', { maxLength: '5' })).toBe('Must be at most 5 characters');
      expect(initJsStringValidator.errorMessage!('Hello', { pattern: '^[a-z]+$' })).toBe('Must match pattern: ^[a-z]+$');
      expect(initJsStringValidator.errorMessage!('hello')).toBe('This field is required'); // Valid fallback
    });

    it('should handle edge cases', async () => {
      expect(await initJsStringValidator.validate(' ', { minLength: '1' })).toBe(true); // Space counts
      expect(await initJsStringValidator.validate('  ', { minLength: '2' })).toBe(true); // Multiple spaces
      expect(await initJsStringValidator.validate('hello', { minLength: '0' })).toBe(true); // Zero minLength
    });
  });

  describe('initJsDateValidator - Complete Coverage', () => {
    it('should have correct plugin metadata', () => {
      expect(initJsDateValidator.name).toBe('init_js_date');
      expect(initJsDateValidator.message).toBe('Invalid date format');
      expect(initJsDateValidator.promptParams).toBeDefined();
    });

    it('should validate various date formats', async () => {
      expect(await initJsDateValidator.validate('2023-01-01')).toBe(true);
      expect(await initJsDateValidator.validate('2023-12-31')).toBe(true);
      expect(await initJsDateValidator.validate('2023-01-01T00:00:00Z')).toBe(true);
      expect(await initJsDateValidator.validate('2023-01-01T12:30:45')).toBe(true);
      expect(await initJsDateValidator.validate('Jan 1, 2023')).toBe(true);
      expect(await initJsDateValidator.validate('1/1/2023')).toBe(true);
    });

    it('should reject invalid dates', async () => {
      expect(await initJsDateValidator.validate('not-a-date')).toBe(false);
      expect(await initJsDateValidator.validate('2023-13-01')).toBe(false); // Invalid month
      expect(await initJsDateValidator.validate('2023-01-32')).toBe(false); // Invalid day
      expect(await initJsDateValidator.validate('2023-02-30')).toBe(false); // Invalid day for February
      expect(await initJsDateValidator.validate('')).toBe(false); // Empty (unless optional)
    });

    it('should handle optional dates', async () => {
      expect(await initJsDateValidator.validate('', { optional: 'true' })).toBe(true);
      expect(await initJsDateValidator.validate('', { optional: 'false' })).toBe(false);
      expect(await initJsDateValidator.validate('2023-01-01', { optional: 'true' })).toBe(true);
    });

    it('should validate minDate constraints', async () => {
      expect(await initJsDateValidator.validate('2023-06-15', { minDate: '2023-01-01' })).toBe(true);
      expect(await initJsDateValidator.validate('2023-01-01', { minDate: '2023-01-01' })).toBe(true); // Equal
      expect(await initJsDateValidator.validate('2022-12-31', { minDate: '2023-01-01' })).toBe(false);
    });

    it('should validate maxDate constraints', async () => {
      expect(await initJsDateValidator.validate('2023-06-15', { maxDate: '2023-12-31' })).toBe(true);
      expect(await initJsDateValidator.validate('2023-12-31', { maxDate: '2023-12-31' })).toBe(true); // Equal
      expect(await initJsDateValidator.validate('2024-01-01', { maxDate: '2023-12-31' })).toBe(false);
    });

    it('should validate date range constraints', async () => {
      const params = { minDate: '2023-01-01', maxDate: '2023-12-31' };
      expect(await initJsDateValidator.validate('2023-06-15', params)).toBe(true);
      expect(await initJsDateValidator.validate('2023-01-01', params)).toBe(true);
      expect(await initJsDateValidator.validate('2023-12-31', params)).toBe(true);
      expect(await initJsDateValidator.validate('2022-12-31', params)).toBe(false);
      expect(await initJsDateValidator.validate('2024-01-01', params)).toBe(false);
    });

    it('should provide correct error messages for all cases', () => {
      expect(initJsDateValidator.errorMessage!('not-a-date')).toBe('Invalid date format');
      expect(initJsDateValidator.errorMessage!('2022-12-31', { minDate: '2023-01-01' })).toBe('Date must be after 2023-01-01');
      expect(initJsDateValidator.errorMessage!('2024-01-01', { maxDate: '2023-12-31' })).toBe('Date must be before 2023-12-31');
      expect(initJsDateValidator.errorMessage!('2023-01-01')).toBe('Invalid date format'); // Valid fallback
      expect(initJsDateValidator.errorMessage!('', { optional: 'true' })).toBe('Invalid date format'); // Should not happen but fallback
    });

    it('should handle various date string formats', async () => {
      const validDates = [
        '2023-01-01',
        '01/01/2023', 
        'January 1, 2023',
        'Jan 1, 2023',
        '2023-01-01T12:00:00',
        '2023-01-01T12:00:00Z',
        '2023-01-01T12:00:00-05:00'
      ];
      
      for (const date of validDates) {
        expect(await initJsDateValidator.validate(date)).toBe(true);
      }
    });
  });

  describe('Integration and Edge Cases', () => {
    it('should handle all validators with empty params', async () => {
      expect(await initJsUrlValidator.validate('https://example.com', {})).toBe(true);
      expect(await initJsNumberValidator.validate('42', {})).toBe(true);
      expect(await initJsStringValidator.validate('hello', {})).toBe(true);
      expect(await initJsDateValidator.validate('2023-01-01', {})).toBe(true);
    });

    it('should handle all validators with undefined params', async () => {
      expect(await initJsUrlValidator.validate('https://example.com')).toBe(true);
      expect(await initJsNumberValidator.validate('42')).toBe(true);
      expect(await initJsStringValidator.validate('hello')).toBe(true);
      expect(await initJsDateValidator.validate('2023-01-01')).toBe(true);
    });

    it('should provide errorMessage fallbacks for all validators', () => {
      // All validators should provide error messages even for valid inputs (fallback behavior)
      expect(initJsUrlValidator.errorMessage!('https://example.com')).toBeDefined();
      expect(initJsNumberValidator.errorMessage!('42')).toBeDefined();
      expect(initJsStringValidator.errorMessage!('hello')).toBeDefined();
      expect(initJsDateValidator.errorMessage!('2023-01-01')).toBeDefined();
    });
  });
});