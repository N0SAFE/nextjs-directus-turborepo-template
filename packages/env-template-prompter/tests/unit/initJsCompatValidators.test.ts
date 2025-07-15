import { describe, it, expect, beforeEach } from 'vitest';
import {
  initJsUrlValidator,
  initJsNumberValidator,
  initJsStringValidator,
  initJsDateValidator
} from '../../src/plugins/validators/initJsCompatValidators.js';

describe('Init.js Compatible Validators', () => {
  describe('initJsUrlValidator', () => {
    it('should validate basic URLs', async () => {
      expect(await initJsUrlValidator.validate('https://example.com')).toBe(true);
      expect(await initJsUrlValidator.validate('http://localhost:3000')).toBe(true);
      expect(await initJsUrlValidator.validate('ftp://ftp.example.com')).toBe(true);
    });

    it('should reject empty URLs', async () => {
      expect(await initJsUrlValidator.validate('')).toBe(false);
    });

    it('should reject malformed URLs', async () => {
      expect(await initJsUrlValidator.validate('not-a-url')).toBe(false);
      expect(await initJsUrlValidator.validate('http://')).toBe(false);
    });

    it('should validate protocol constraints', async () => {
      const params = { protocol: 'https' };
      expect(await initJsUrlValidator.validate('https://example.com', params)).toBe(true);
      expect(await initJsUrlValidator.validate('http://example.com', params)).toBe(false);
    });

    it('should validate hostname constraints', async () => {
      const params = { hostname: 'localhost,example.com' };
      expect(await initJsUrlValidator.validate('https://localhost', params)).toBe(true);
      expect(await initJsUrlValidator.validate('https://example.com', params)).toBe(true);
      expect(await initJsUrlValidator.validate('https://other.com', params)).toBe(false);
    });

    it('should validate port constraints', async () => {
      const params = { port: '3000' };
      expect(await initJsUrlValidator.validate('https://example.com:3000', params)).toBe(true);
      expect(await initJsUrlValidator.validate('https://example.com:8080', params)).toBe(false);
    });

    it('should provide correct error messages', () => {
      expect(initJsUrlValidator.errorMessage!('', {})).toBe('URL is required');
      expect(initJsUrlValidator.errorMessage!('not-a-url', {})).toBe('Invalid URL format');
      expect(initJsUrlValidator.errorMessage!('http://example.com', { protocol: 'https' })).toBe('Protocol must be one of: https');
      expect(initJsUrlValidator.errorMessage!('https://other.com', { hostname: 'localhost' })).toBe('Hostname must be one of: localhost');
      expect(initJsUrlValidator.errorMessage!('https://example.com:8080', { port: '3000' })).toBe('Port must be: 3000');
    });
  });

  describe('initJsNumberValidator', () => {
    it('should validate basic numbers', async () => {
      expect(await initJsNumberValidator.validate('42')).toBe(true);
      expect(await initJsNumberValidator.validate('3.14')).toBe(true);
      expect(await initJsNumberValidator.validate('-10')).toBe(true);
    });

    it('should reject non-numbers', async () => {
      expect(await initJsNumberValidator.validate('not-a-number')).toBe(false);
      expect(await initJsNumberValidator.validate('')).toBe(false);
    });

    it('should validate allow list first', async () => {
      const params = { allow: '80,443,8080', min: '1000' };
      expect(await initJsNumberValidator.validate('80', params)).toBe(true); // In allow list
      expect(await initJsNumberValidator.validate('500', params)).toBe(false); // Not in allow list and below min
    });

    it('should validate min/max constraints', async () => {
      const params = { min: '10', max: '100' };
      expect(await initJsNumberValidator.validate('50', params)).toBe(true);
      expect(await initJsNumberValidator.validate('5', params)).toBe(false);
      expect(await initJsNumberValidator.validate('150', params)).toBe(false);
    });

    it('should provide correct error messages', () => {
      expect(initJsNumberValidator.errorMessage!('not-a-number', {})).toBe('Must be a valid number');
      expect(initJsNumberValidator.errorMessage!('5', { min: '10' })).toBe('Must be at least 10');
      expect(initJsNumberValidator.errorMessage!('150', { max: '100' })).toBe('Must be at most 100');
      expect(initJsNumberValidator.errorMessage!('5', { min: '10', allow: '80,443' })).toBe('Must be at least 10 or one of: 80,443');
    });
  });

  describe('initJsStringValidator', () => {
    it('should validate required strings', async () => {
      expect(await initJsStringValidator.validate('hello')).toBe(true);
    });

    it('should reject empty required strings', async () => {
      expect(await initJsStringValidator.validate('')).toBe(false);
    });

    it('should allow empty optional strings', async () => {
      const params = { optional: 'true' };
      expect(await initJsStringValidator.validate('', params)).toBe(true);
    });

    it('should validate length constraints', async () => {
      const params = { minLength: '3', maxLength: '10' };
      expect(await initJsStringValidator.validate('hello', params)).toBe(true);
      expect(await initJsStringValidator.validate('hi', params)).toBe(false);
      expect(await initJsStringValidator.validate('this is too long', params)).toBe(false);
    });

    it('should validate pattern constraints', async () => {
      const params = { pattern: '^[a-z]+$' };
      expect(await initJsStringValidator.validate('hello', params)).toBe(true);
      expect(await initJsStringValidator.validate('Hello', params)).toBe(false);
    });

    it('should provide correct error messages', () => {
      expect(initJsStringValidator.errorMessage!('', {})).toBe('This field is required');
      expect(initJsStringValidator.errorMessage!('hi', { minLength: '3' })).toBe('Must be at least 3 characters');
      expect(initJsStringValidator.errorMessage!('this is too long', { maxLength: '10' })).toBe('Must be at most 10 characters');
      expect(initJsStringValidator.errorMessage!('Hello', { pattern: '^[a-z]+$' })).toBe('Must match pattern: ^[a-z]+$');
    });
  });

  describe('initJsDateValidator', () => {
    it('should validate valid dates', async () => {
      expect(await initJsDateValidator.validate('2023-01-01')).toBe(true);
      expect(await initJsDateValidator.validate('2023-12-31T23:59:59Z')).toBe(true);
    });

    it('should reject invalid dates', async () => {
      expect(await initJsDateValidator.validate('not-a-date')).toBe(false);
      expect(await initJsDateValidator.validate('2023-13-01')).toBe(false);
    });

    it('should allow empty optional dates', async () => {
      const params = { optional: 'true' };
      expect(await initJsDateValidator.validate('', params)).toBe(true);
    });

    it('should validate date range constraints', async () => {
      const params = { minDate: '2023-01-01', maxDate: '2023-12-31' };
      expect(await initJsDateValidator.validate('2023-06-15', params)).toBe(true);
      expect(await initJsDateValidator.validate('2022-12-31', params)).toBe(false);
      expect(await initJsDateValidator.validate('2024-01-01', params)).toBe(false);
    });

    it('should provide correct error messages', () => {
      expect(initJsDateValidator.errorMessage!('not-a-date', {})).toBe('Invalid date format');
      expect(initJsDateValidator.errorMessage!('2022-12-31', { minDate: '2023-01-01' })).toBe('Date must be after 2023-01-01');
      expect(initJsDateValidator.errorMessage!('2024-01-01', { maxDate: '2023-12-31' })).toBe('Date must be before 2023-12-31');
    });
  });
});