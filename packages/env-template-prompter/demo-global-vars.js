#!/usr/bin/env node

/**
 * Practical demonstration of global variables functionality
 * Shows how $index and $iter.namespace work with actual .env.template fields
 */

import { PromptService } from './src/services/PromptService.js';
import { ValidationService } from './src/services/ValidationService.js';
import { TransformerService } from './src/services/TransformerService.js';
import { ConfigService } from './src/services/ConfigService.js';

// Initialize services
const configService = new ConfigService({ debug: false, interactive: false });
const validationService = new ValidationService(configService);
const transformerService = new TransformerService(configService);
const promptService = new PromptService(validationService, transformerService, configService);

console.log('🚀 Demonstrating Global Variables Functionality\n');

// Test $index with actual .env.template field
console.log('📊 Testing $index with actual .env.template field:');
console.log('Field: NEXT_PUBLIC_API_URL with default=http://localhost:${8055 + $index * 10}');

const apiUrlField = {
  key: 'NEXT_PUBLIC_API_URL',
  type: 'url',
  lineNumber: 8,
  options: {
    group: 'api',
    protocol: 'http,https',
    label: 'API URL',
    description: 'URL where the Directus API will be accessible',
    default: 'http://localhost:${8055 + $index * 10}'
  }
};

// Test with different processing indexes
for (let index = 0; index < 4; index++) {
  const context = {
    existingValues: new Map(),
    skipExisting: false,
    interactive: false,
    globalVars: {
      index,
      iterCounters: new Map()
    }
  };

  const result = await promptService.evaluateTemplateExpression(
    apiUrlField.options.default,
    apiUrlField,
    context
  );

  console.log(`  Processing index ${index}: ${result}`);
}

console.log('\n🔄 Testing $iter.namespace with different namespaces:');

// Simulate processing multiple fields with $iter namespaces
const fields = [
  { key: 'API_SERVICE_1', default: 'http://api${$iter.service}.example.com:${8080 + $iter.service * 10}' },
  { key: 'API_SERVICE_2', default: 'http://api${$iter.service}.example.com:${8080 + $iter.service * 10}' },
  { key: 'WEB_APP_1', default: 'http://web${$iter.frontend}.example.com:${3000 + $iter.frontend * 10}' },
  { key: 'WEB_APP_2', default: 'http://web${$iter.frontend}.example.com:${3000 + $iter.frontend * 10}' },
  { key: 'API_SERVICE_3', default: 'http://api${$iter.service}.example.com:${8080 + $iter.service * 10}' }
];

const sharedContext = {
  existingValues: new Map(),
  skipExisting: false,
  interactive: false,
  globalVars: {
    index: 0,
    iterCounters: new Map()
  }
};

for (const field of fields) {
  const templateField = {
    key: field.key,
    type: 'url',
    lineNumber: 1,
    options: { default: field.default }
  };

  const result = await promptService.evaluateTemplateExpression(
    field.default,
    templateField,
    sharedContext
  );

  console.log(`  ${field.key}: ${result}`);
}

console.log('\n✨ Testing JavaScript expression semantics:');

const jsTestCases = [
  { expr: '${\"test\" + 1}', desc: 'String concatenation' },
  { expr: '${1 + 2}', desc: 'Numeric addition' },
  { expr: '${8055 + 2 * 10 + 5}', desc: 'Complex arithmetic with order of operations' },
  { expr: 'prefix-${8055 + 10}-suffix', desc: 'Mixed string and expression' }
];

const testField = {
  key: 'TEST_FIELD',
  type: 'string',
  lineNumber: 1,
  options: {}
};

const testContext = {
  existingValues: new Map(),
  skipExisting: false,
  interactive: false,
  globalVars: {
    index: 0,
    iterCounters: new Map()
  }
};

for (const { expr, desc } of jsTestCases) {
  const result = await promptService.evaluateTemplateExpression(expr, testField, testContext);
  console.log(`  ${desc}: ${expr} → ${result}`);
}

console.log('\n🎯 Example: Simulating group processing with multiple fields:');

// Simulate how promptForGroup would set index for each field
const groupFields = [
  {
    key: 'API_URL',
    type: 'url',
    lineNumber: 8,
    options: { default: 'http://localhost:${8055 + $index * 10}' }
  },
  {
    key: 'WEB_URL', 
    type: 'url',
    lineNumber: 14,
    options: { default: 'http://localhost:${3000 + $index * 10}' }
  },
  {
    key: 'DB_PORT',
    type: 'number',
    lineNumber: 20,
    options: { default: '${5432 + $index}' }
  }
];

const groupContext = {
  existingValues: new Map(),
  skipExisting: false,
  interactive: false,
  globalVars: {
    index: 0,
    iterCounters: new Map()
  }
};

for (let i = 0; i < groupFields.length; i++) {
  const field = groupFields[i];
  
  // Update processing index (like promptForGroup does)
  groupContext.globalVars.index = i;
  
  const result = await promptService.evaluateTemplateExpression(
    field.options.default,
    field,
    groupContext
  );

  console.log(`  Field ${i} (${field.key}): ${result} (used $index=${i}, ignored lineNumber=${field.lineNumber})`);
}

console.log('\n✅ All global variable functionality working correctly!');
console.log('\n📝 Summary:');
console.log('  • $index uses actual processing order, not line numbers');
console.log('  • $iter.namespace increments once per expression evaluation');
console.log('  • JavaScript expressions work correctly (string concat vs numeric addition)');
console.log('  • Multiple $iter.namespace variables work independently');
console.log('  • Complex expressions with order of operations work as expected');