#!/usr/bin/env node

/**
 * Demo script showing the env-template-prompter package usage
 * 
 * This demonstrates the complete TypeScript service-based architecture
 * with the new plugin system that we've built during this conversation.
 */

import { 
  EnvTemplatePrompter,
  getAllDefaultPlugins,
  getDefaultTransformerPlugins,
  getDefaultValidatorPlugins,
  PluginRegistry,
  extractPortTransformer,
  urlValidator
} from './dist/index.js';

async function demo() {
  try {
    console.log('🚀 ENV Template Prompter Demo - Plugin System');
    console.log('==============================================\n');

    // Demonstrate plugin system
    console.log('🔌 Plugin System Overview:');
    const allPlugins = getAllDefaultPlugins();
    console.log(`📦 Default Transformers: ${allPlugins.transformers.length}`);
    allPlugins.transformers.forEach(t => {
      console.log(`   - ${t.name}: ${t.description || 'No description'}`);
    });
    console.log(`📦 Default Validators: ${allPlugins.validators.length}`);
    allPlugins.validators.forEach(v => {
      console.log(`   - ${v.name}: ${v.message || 'No message'}`);
    });
    console.log('');

    // Test individual plugins
    console.log('🧪 Testing Individual Plugins:');
    
    // Test extract_port transformer
    const portContext = {
      sourceValue: 'https://api.example.com:3001/graphql',
      allValues: new Map(),
      field: {},
      templateFields: []
    };
    
    const extractedPort = extractPortTransformer.transform('', { source: 'API_URL' }, portContext);
    console.log(`✨ extract_port('https://api.example.com:3001/graphql') => '${extractedPort}'`);
    
    // Test URL validator
    const validUrl = urlValidator.validate('https://example.com');
    const invalidUrl = urlValidator.validate('not-a-url');
    console.log(`✨ urlValidator('https://example.com') => ${validUrl}`);
    console.log(`✨ urlValidator('not-a-url') => ${invalidUrl}`);
    console.log('');

    // Demonstrate PluginRegistry
    console.log('🗂️ Plugin Registry Demo:');
    const registry = new PluginRegistry(true); // Auto-load defaults
    
    // Add custom transformer
    registry.registerTransformer({
      name: 'to_uppercase',
      description: 'Converts value to uppercase',
      transform: (value) => value.toUpperCase()
    });
    
    // Add custom validator
    registry.registerValidator({
      name: 'min_5_chars',
      message: 'Must be at least 5 characters',
      validate: (value) => value.length >= 5
    });
    
    const stats = registry.getStats();
    console.log(`📊 Registry Stats: ${stats.transformers} transformers, ${stats.validators} validators`);
    console.log(`🔧 Custom transformer 'to_uppercase' registered: ${registry.hasTransformer('to_uppercase')}`);
    console.log(`✅ Custom validator 'min_5_chars' registered: ${registry.hasValidator('min_5_chars')}`);
    console.log('');

    // Create prompter with debug mode
    console.log('🎛️ Creating EnvTemplatePrompter with Plugin Support:');
    const prompter = new EnvTemplatePrompter({
      debugMode: false, // Disable debug for cleaner output
      templatePath: './example.env.template',
      outputPath: './example.env',
      interactive: false // Non-interactive for demo
    });

    console.log('📋 Available Services:');
    console.log('- ConfigService: Runtime configuration & debug management');
    console.log('- TemplateParserService: Parse .env.template files');
    console.log('- ValidationService: Validate user input (with plugin validators)');
    console.log('- TransformerService: Apply value transformations (with plugin transformers)');
    console.log('- GroupingService: Organize fields into groups');
    console.log('- PromptService: Handle user prompts');
    console.log('- OutputService: Generate .env files\n');

    // Advanced template with transformers
    const templateContent = `# Advanced Template with Plugins
API_URL={{string|value=https://localhost:3001|description=API base URL}}
API_PORT={{number|transformer=extract_port|source=@{API_URL}|auto_derive=true|description=Extracted API port}}
DATABASE_URL={{string|value=postgres://user:password@localhost:5432/myapp|description=Database connection string}}
DATABASE_HOST={{string|transformer=extract_hostname|source=@{DATABASE_URL}|auto_derive=true|description=Extracted database host}}
CORS_ORIGINS={{string|transformer=cors_origins|auto_generate=true|description=Auto-generated CORS origins}}
SECRET_KEY={{string|transformer=generate_secret|length=32|description=Generated secret key}}`;

    console.log('📄 Advanced Template with Plugin Transformers:');
    console.log(templateContent);
    console.log('\n🔍 Parsing template with plugin support...\n');

    // Parse template
    const fields = prompter.services.templateParserService.parseTemplate(templateContent);
    
    console.log(`✨ Parsed ${fields.length} fields with plugin integration:`);
    fields.forEach((field, index) => {
      console.log(`${index + 1}. ${field.key} (${field.type})`);
      if (field.options.description) {
        console.log(`   📝 ${field.options.description}`);
      }
      if (field.options.transformer) {
        console.log(`   🔧 Transformer: ${field.options.transformer}`);
      }
      if (field.options.source) {
        console.log(`   🔗 Source: ${field.options.source}`);
      }
      console.log('');
    });

    // Test service plugin integration
    console.log('🔗 Service Plugin Integration:');
    const transformerCount = prompter.services.transformerService.getRegisteredTransformers().length;
    const validatorCount = prompter.services.validationService.getRegisteredValidators().length;
    
    console.log(`🔧 TransformerService: ${transformerCount} registered transformers`);
    console.log(`✅ ValidationService: ${validatorCount} registered validators`);

    console.log('\n✅ Demo completed successfully!');
    console.log('\n🎯 This demonstrates:');
    console.log('- Plugin-based architecture with default and custom plugins');
    console.log('- Service integration with plugin system');
    console.log('- Template parsing with transformer support');
    console.log('- PluginRegistry for managing custom plugins');
    console.log('- Individual plugin testing and validation');
    console.log('- TypeScript type safety throughout the plugin system');

  } catch (error) {
    console.error('❌ Demo failed:', error);
    console.error(error.stack);
  }
}

// Run demo if this file is executed directly
if (require.main === module) {
  demo().catch(console.error);
}

export { demo };
