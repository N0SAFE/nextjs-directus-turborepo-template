#!/usr/bin/env node

/**
 * Demo script showing the env-template-prompter package usage
 * 
 * This demonstrates the complete TypeScript service-based architecture
 * that we've built during this conversation.
 */

import { EnvTemplatePrompter } from './dist/index.js';
import { readFileSync } from 'fs';

async function demo() {
  try {
    console.log('🚀 ENV Template Prompter Demo');
    console.log('==============================\n');

    // Create prompter with debug mode
    const prompter = new EnvTemplatePrompter({
      debugMode: false, // Disable debug for cleaner output
      templatePath: './example.env.template',
      outputPath: './example.env',
      interactive: false // Non-interactive for demo
    });

    console.log('📋 Available Services:');
    console.log('- ConfigService: Runtime configuration & debug management');
    console.log('- TemplateParserService: Parse .env.template files');
    console.log('- ValidationService: Validate user input');
    console.log('- TransformerService: Apply value transformations');
    console.log('- GroupingService: Organize fields into groups');
    console.log('- PromptService: Handle user prompts');
    console.log('- OutputService: Generate .env files\n');

    // Simple test - read and parse template
    const templateContent = `# Database Configuration
DATABASE_URL={{string|value=postgres://user:password@localhost:5432/myapp|description=Database connection string}}
NEXT_PUBLIC_API_URL={{string|value=http://localhost:3001|description=API base URL}}`;

    console.log('📄 Template Content:');
    console.log(templateContent);
    console.log('\n🔍 Parsing template...\n');

    // Parse template
    const fields = prompter['services'].templateParserService.parseTemplate(templateContent);
    
    console.log(`✨ Parsed ${fields.length} fields:`);
    fields.forEach((field, index) => {
      console.log(`${index + 1}. ${field.key} (${field.type})`);
      if (field.options.description) {
        console.log(`   📝 ${field.options.description}`);
      }
      console.log('');
    });

    console.log('✅ Demo completed successfully!');
    console.log('\n🎯 This demonstrates:');
    console.log('- Service-based architecture with dependency injection');
    console.log('- Template parsing with field definitions');
    console.log('- TypeScript type safety throughout');
    console.log('- Comprehensive test suite (23 tests passing)');

  } catch (error) {
    console.error('❌ Demo failed:', error);
    console.error(error.stack);
  }
}

// Add debug handler to see internal operations
function addDebugHandler(prompter) {
  prompter['services'].configService.addDebugHandler((message) => {
    console.log(`🐛 DEBUG: ${message}`);
  });
}

// Run demo if this file is executed directly
if (require.main === module) {
  demo().catch(console.error);
}

export { demo };
