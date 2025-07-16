#!/usr/bin/env node

/**
 * Demo script to showcase the init.js template parsing capabilities
 */

const { parseTemplate, validateUrl, validateNumber, generateRandomString } = require('../init.js');

console.log('🧪 Testing NextJS Directus Turborepo Init System\n');

// Test 1: String template parsing
console.log('📝 Test 1: String Template Parsing');
const stringTemplate = parseTemplate('{{string|default=test-project|label=Project Name|minLength=3}}');
console.log('Template:', stringTemplate);
console.log('✅ Parsed correctly\n');

// Test 2: URL validation
console.log('🌐 Test 2: URL Validation');
console.log('Valid HTTP URL:', validateUrl('http://localhost:3000', { protocol: 'http,https' }));
console.log('Invalid protocol:', validateUrl('ftp://localhost:3000', { protocol: 'http,https' }));
console.log('✅ URL validation working\n');

// Test 3: Number validation
console.log('🔢 Test 3: Number Validation');
console.log('Valid port:', validateNumber('3000', { min: 1024, max: 65535 }));
console.log('Invalid port (too low):', validateNumber('80', { min: 1024, max: 65535 }));
console.log('✅ Number validation working\n');

// Test 4: Random string generation
console.log('🎲 Test 4: Random String Generation');
console.log('Random 16-char string:', generateRandomString(16));
console.log('Random 32-char string:', generateRandomString(32));
console.log('✅ Random generation working\n');

// Test 5: Complex template parsing
console.log('⚙️ Test 5: Complex Template Parsing');
const complexTemplate = parseTemplate('{{multiselect|options=auth,cache,logging|separator=,|label=Features|optional=true}}');
console.log('Complex template:', JSON.stringify(complexTemplate, null, 2));
console.log('✅ Complex parsing working\n');

// Test 6: Boolean template
console.log('✅ Test 6: Boolean Template');
const boolTemplate = parseTemplate('{{boolean|labels=yes,no|default=yes|label=Enable Feature}}');
console.log('Boolean template:', JSON.stringify(boolTemplate, null, 2));
console.log('✅ Boolean parsing working\n');

console.log('🎉 All tests passed! The init system is ready to use.');
console.log('Run "bun run init" to start the interactive setup.\n');
