#!/usr/bin/env node

const { TemplateParserService, ValidationService, ConfigService } = require('./dist/index.cjs');

async function testSelectValidation() {
  console.log('=== Testing Select Field Validation Fix ===\n');
  
  // Create services
  const configService = new ConfigService({ debug: true, interactive: false });
  const validationService = new ValidationService(configService);
  const parserService = new TemplateParserService(configService, validationService);
  
  // Test the NODE_ENV field specifically
  const nodeEnvTemplate = 'NODE_ENV={{select|group=environment|options=development,production,test|default=0|label=Node Environment|description=Current environment mode}}';
  
  console.log('Template line:', nodeEnvTemplate);
  
  // Parse just this field
  const field = parserService.extractFieldDefinition(nodeEnvTemplate);
  console.log('\nParsed field:', JSON.stringify(field, null, 2));
  
  if (!field) {
    console.log('❌ No field parsed');
    return;
  }
  
  console.log('\nField options:', JSON.stringify(field.options, null, 2));
  
  // Test validation of different values
  console.log('\n=== Testing Validation ===');
  const testValues = ['development', 'production', 'test', 'invalid', ''];
  
  for (const testValue of testValues) {
    const testResult = await validationService.validateField(testValue, field);
    console.log(`"${testValue}": ${testResult.valid ? '✅' : '❌'} ${testResult.errors.join(', ')}`);
  }
  
  console.log('\n=== Testing Default Resolution ===');
  // Test that default=0 should resolve to "development"
  console.log('Default value from field:', field.options.default);
  if (typeof field.options.default === 'number' && field.options.options) {
    const options = field.options.options.split(',').map(v => v.trim());
    const resolvedDefault = options[field.options.default];
    console.log('Options:', options);
    console.log('Resolved default:', resolvedDefault);
    
    const defaultValidation = await validationService.validateField(resolvedDefault, field);
    console.log(`Resolved default validation: ${defaultValidation.valid ? '✅' : '❌'} ${defaultValidation.errors.join(', ')}`);
  }
}

testSelectValidation().catch(console.error);