#!/usr/bin/env bun

import path from 'path';
import { readFileSync } from 'fs';
import { TemplateParserService, GroupingService, ConfigService, TemplateField, ValidationService } from '../index.js';

function getDependencyGraph(fields: TemplateField[]) {
  const graph: Record<string, string[]> = {};
  for (const field of fields) {
    graph[field.key] = [];
    if (field.options.from && typeof field.options.from === 'string') {
      graph[field.key]?.push(field.options.from);
    }
    if (field.options.from_urls && typeof field.options.from_urls === 'string') {
      graph[field.key]?.push(...field.options.from_urls.split(','));
    }
  }
  return graph;
}

function printDependencyGraph(graph: Record<string, string[]>) {
  console.log('\nDependency Graph:');
  for (const [key, deps] of Object.entries(graph)) {
    if (deps.length > 0) {
      console.log(`- ${key} depends on: ${deps.join(', ')}`);
    } else {
      console.log(`- ${key} has no dependencies`);
    }
  }
}

async function main() {
  const configService = new ConfigService();
  const templatePath = path.resolve(process.cwd(), '.env.template');
  const templateContent = readFileSync(templatePath, 'utf-8');
  const validationService = new ValidationService(configService);
  const parser = new TemplateParserService(configService, validationService);
  const fields = parser.parseTemplate(templateContent);

  // Group info
  const groupingService = new GroupingService(configService);
  const groups = groupingService.groupFields(fields);

  console.log('Groups in use:', groups.groups.keys());

  // Dependency graph
  const depGraph = getDependencyGraph(fields);
  printDependencyGraph(depGraph);
}

export default main;