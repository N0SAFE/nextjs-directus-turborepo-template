import { writeFile, mkdir, access, copyFile } from 'fs/promises';
import { dirname } from 'path';
import { existsSync } from 'fs';
import type {
  TemplateField,
  GroupedFields,
  OutputOptions,
  OutputResult,
  ValidationResult
} from '../types/index.js';
import type { IOutputService, IConfigService } from '../types/services.js';

export class OutputService implements IOutputService {
  public readonly serviceName = 'OutputService';

  constructor(private configService: IConfigService) {}

  public generateEnvFile(
    values: Map<string, string>, 
    template: TemplateField[], 
    options: OutputOptions = {
      includeComments: true,
      preserveOrder: true,
      groupSeparators: true,
      timestampHeader: true
    }
  ): string {
    this.configService.debug(`Generating .env file with ${values.size} values`, this.serviceName);

    let content = '';

    // Add header with timestamp
    if (options.timestampHeader) {
      content += this.addHeader('', true);
    }

    // Sort fields by line number if preserving order
    const sortedTemplate = options.preserveOrder 
      ? [...template].sort((a, b) => a.lineNumber - b.lineNumber)
      : template;

    // Generate field entries, skipping SYSTEM_ENV_TEMPLATE_CONFIG and skip_export=true
    for (const field of sortedTemplate) {
      // Skip SYSTEM_ENV_TEMPLATE_CONFIG
      if (field.key === 'SYSTEM_ENV_TEMPLATE_CONFIG') {
        continue;
      }
      // Skip fields with skip_export=true in options or template
      if (field.options && (field.options.skip_export === true || field.options.skip_export === 'true')) {
        continue;
      }
      const value = values.get(field.key);
      if (value !== undefined) {
        content += this.formatFieldValue(field.key, value, field) + '\n';
      }
    }

    // Add comments if requested
    if (options.includeComments) {
      content = this.addComments(content, template);
    }

    this.configService.debug(`Generated .env content (${content.length} characters)`, this.serviceName);
    return content;
  }

  public async writeEnvFile(content: string, path: string): Promise<OutputResult> {
    this.configService.debug(`Writing .env file to: ${path}`, this.serviceName);

    const errors: string[] = [];

    try {
      // Ensure directory exists
      await this.ensureDirectoryExists(path);

      // Check write permissions
      const canWrite = await this.checkWritePermissions(path);
      if (!canWrite) {
        errors.push(`No write permissions for: ${path}`);
      }

      // Create backup if file exists
      let backupPath = '';
      if (existsSync(path)) {
        try {
          backupPath = await this.createBackup(path);
          this.configService.debug(`Created backup: ${backupPath}`, this.serviceName);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown backup error';
          errors.push(`Failed to create backup: ${message}`);
        }
      }

      // Validate content before writing
      const validation = this.validateOutput(content);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }

      // Write file
      await writeFile(path, content, 'utf-8');

      const result: OutputResult = {
        success: errors.length === 0,
        path,
        content,
        fieldCount: (content.match(/^[A-Z_][A-Z0-9_]*=/gm) || []).length,
        errors
      };

      this.configService.debug(
        `File write ${result.success ? 'successful' : 'failed'}: ${result.fieldCount} fields`,
        this.serviceName
      );

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown write error';
      errors.push(`Failed to write file: ${message}`);
      
      return {
        success: false,
        path,
        content,
        fieldCount: 0,
        errors
      };
    }
  }

  public formatFieldValue(key: string, value: string, _field: TemplateField): string {
    // Handle multiline values
    if (value.includes('\n')) {
      // Escape newlines for .env format
      const escapedValue = value.replace(/\n/g, '\\n');
      return `${key}="${escapedValue}"`;
    }

    // Quote values that contain spaces or special characters
    if (value.includes(' ') || value.includes('#') || value.includes('"') || value.includes("'")) {
      const escapedValue = value.replace(/"/g, '\\"');
      return `${key}="${escapedValue}"`;
    }

    // Simple key=value format
    return `${key}=${value}`;
  }

  public addComments(content: string, fields: TemplateField[]): string {
    const lines = content.split('\n');
    const commentedLines: string[] = [];

    for (const line of lines) {
      commentedLines.push(line);

      // Check if this line is a field definition
      const fieldMatch = line.match(/^([A-Z_][A-Z0-9_]*)=/);
      if (fieldMatch) {
        const fieldKey = fieldMatch[1];
        const field = fields.find(f => f.key === fieldKey);
        
        if (field) {
          // Add comment about field type and constraints
          const comment = this.generateFieldComment(field);
          if (comment) {
            commentedLines.splice(-1, 0, `# ${comment}`);
          }
        }
      }
    }

    return commentedLines.join('\n');
  }

  public addGroupSeparators(content: string, _groups: GroupedFields): string {
    // Add group info and separators using _groups.groupInfo
    if (!_groups.groupInfo || _groups.groupOrder.length === 0) {
      this.configService.debug('No group info available for separators', this.serviceName);
      return content;
    }
    const lines = content.split('\n');
    const resultLines: string[] = [];
    for (const groupKey of _groups.groupOrder) {
      const info = _groups.groupInfo.get(groupKey);
      if (info) {
        resultLines.push(`#\n# --- ${info.name} ---`);
        if (info.description) {
          resultLines.push(`# ${info.description}`);
        }
        resultLines.push('#');
      }
      // Add all fields for this group
      const groupFields = _groups.groups.get(groupKey);
      if (groupFields) {
        for (const field of groupFields) {
          // Find the line for this field
          const fieldLine = lines.find(l => l.startsWith(field.key + '='));
          if (fieldLine) {
            resultLines.push(fieldLine);
          }
        }
      }
    }
    // Add ungrouped fields at the end
    if (_groups.ungrouped.length > 0) {
      resultLines.push(`#\n# --- General Configuration ---\n#`);
      for (const field of _groups.ungrouped) {
        const fieldLine = lines.find(l => l.startsWith(field.key + '='));
        if (fieldLine) {
          resultLines.push(fieldLine);
        }
      }
    }
    return resultLines.join('\n');
  }

  public addHeader(content: string, timestamp: boolean): string {
    const lines = [
      '# Environment Configuration',
      '# Generated by @repo/env-template-prompter'
    ];

    if (timestamp) {
      lines.push(`# Generated at: ${new Date().toISOString()}`);
    }

    lines.push('# WARNING: Do not edit this file directly');
    lines.push('# Use .env.template to configure and regenerate');
    lines.push('');

    return lines.join('\n') + (content ? '\n' + content : '');
  }

  public async createBackup(path: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${path}.backup.${timestamp}`;
    
    await copyFile(path, backupPath);
    return backupPath;
  }

  public validateOutput(content: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const lines = content.split('\n');
    const seenKeys = new Set<string>();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNumber = i + 1;

      // Skip empty lines and comments
      if (!line || line.startsWith('#')) {
        continue;
      }

      // Check for valid environment variable format
      const envVarMatch = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (!envVarMatch) {
        errors.push(`Invalid environment variable format at line ${lineNumber}: ${line}`);
        continue;
      }

      const [, key, value] = envVarMatch;

      // Check for duplicate keys
      if (seenKeys.has(key)) {
        errors.push(`Duplicate environment variable: ${key} at line ${lineNumber}`);
      } else {
        seenKeys.add(key);
      }

      // Check for potentially problematic values
      if (value.includes('\n') && !value.startsWith('"')) {
        warnings.push(`Multiline value for ${key} should be quoted at line ${lineNumber}`);
      }

      if (value.includes(' ') && !value.startsWith('"') && !value.startsWith("'")) {
        warnings.push(`Value with spaces for ${key} should be quoted at line ${lineNumber}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  public generateDockerComposeEnv(values: Map<string, string>): string {
    const lines = ['# Docker Compose Environment Variables', ''];
    
    for (const [key, value] of values) {
      lines.push(`${key}=${value}`);
    }

    return lines.join('\n');
  }

  public generateJSONConfig(values: Map<string, string>): string {
    const config: Record<string, string> = {};
    for (const [key, value] of values) {
      config[key] = value;
    }
    return JSON.stringify(config, null, 2);
  }

  public generateYAMLConfig(values: Map<string, string>): string {
    const lines = ['# YAML Configuration', ''];
    
    for (const [key, value] of values) {
      // Convert to camelCase for YAML
      const yamlKey = key.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      
      // Quote values that need it
      const yamlValue = value.includes(':') || value.includes('#') ? `"${value}"` : value;
      
      lines.push(`${yamlKey}: ${yamlValue}`);
    }

    return lines.join('\n');
  }

  public async ensureDirectoryExists(filePath: string): Promise<void> {
    const dir = dirname(filePath);
    
    try {
      await access(dir);
    } catch {
      // Directory doesn't exist, create it
      await mkdir(dir, { recursive: true });
      this.configService.debug(`Created directory: ${dir}`, this.serviceName);
    }
  }

  public async checkWritePermissions(path: string): Promise<boolean> {
    try {
      const dir = dirname(path);
      await access(dir);
      
      // If file exists, check if we can write to it
      if (existsSync(path)) {
        await access(path);
      }
      
      return true;
    } catch {
      return false;
    }
  }

  private generateFieldComment(field: TemplateField): string {
    const parts: string[] = [];

    // Add type information
    parts.push(`Type: ${field.type}`);

    // Add constraints
    if (field.options.min !== undefined || field.options.max !== undefined) {
      const { min, max } = field.options;
      if (min !== undefined && max !== undefined) {
        parts.push(`Range: ${min}-${max}`);
      } else if (min !== undefined) {
        parts.push(`Minimum: ${min}`);
      } else if (max !== undefined) {
        parts.push(`Maximum: ${max}`);
      }
    }

    if (field.options.allow) {
      parts.push(`Allowed: ${field.options.allow}`);
    }

    // Add transformer info
    if (field.options.transformer) {
      parts.push(`Transformer: ${field.options.transformer}`);
    }

    return parts.join(', ');
  }
}
