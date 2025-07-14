import type {
  TemplateField,
  GroupedFields,
  GroupConfiguration,
  ValidationResult
} from '../types/index.js';
import type { IGroupingService, IConfigService } from '../types/services.js';

export class GroupingService implements IGroupingService {
  public readonly serviceName = 'GroupingService';

  constructor(private configService: IConfigService) {}

  public groupFields(fields: TemplateField[], config?: GroupConfiguration): GroupedFields {
    this.configService.debug(`Grouping ${fields.length} fields`, this.serviceName);

    // Extract explicit group configuration from SYSTEM_ENV_TEMPLATE_CONFIG if present
    let groupConfig = config || this.extractGroupConfiguration(fields);
    let groupDefs: Array<{id: string, name: string, description?: string}> = [];
    if (!groupConfig) {
      groupConfig = {
        groups: {},
        autoDetect: true,
        ungroupedTitle: 'General Configuration'
      };
    }
    // If SYSTEM_ENV_TEMPLATE_CONFIG is present, parse its groups array for full info
    const configField = fields.find(f => f.key === 'SYSTEM_ENV_TEMPLATE_CONFIG');
    let configJsonStr = '';
    if (configField && configField.options) {
      // Try to extract the 'default' parameter from options
      if (typeof configField.options.default === 'string') {
        configJsonStr = configField.options.default;
      } else if (configField.options.value && typeof configField.options.value === 'string') {
        configJsonStr = configField.options.value;
      }
      try {
        const configJson = JSON.parse(configJsonStr);
        if (Array.isArray(configJson.groups)) {
          groupDefs = configJson.groups;
          // Build groupConfig.groups as { id: name }
          groupConfig.groups = {};
          for (const def of groupDefs) {
            groupConfig.groups[def.id] = def.name;
          }
        }
      } catch (e) {
        this.configService.debug('Failed to parse SYSTEM_ENV_TEMPLATE_CONFIG for group definitions', this.serviceName);
      }
    }

    const groups = new Map<string, TemplateField[]>();
    const ungrouped: TemplateField[] = [];
    const groupTitles = new Map<string, string>();
    const groupInfo = new Map<string, {id: string, name: string, description?: string}>();

    // Set up group titles and info from groupDefs
    if (groupDefs.length === 0 && groupConfig && groupConfig.groups) {
      // Fallback: build groupDefs from groupConfig.groups if possible
      for (const id of Object.keys(groupConfig.groups)) {
        groupDefs.push({ id, name: groupConfig.groups[id] });
      }
    }
    for (const def of groupDefs) {
      groupTitles.set(def.id, def.name);
      groupInfo.set(def.id, def);
      groups.set(def.id, []);
    }

    // Auto-detect additional groups if enabled
    let autoDetectedGroups: Record<string, string> = {};
    if (groupConfig.autoDetect) {
      autoDetectedGroups = this.autoDetectGroups(fields);
      for (const [groupKey, title] of Object.entries(autoDetectedGroups)) {
        if (!groupTitles.has(groupKey)) {
          groupTitles.set(groupKey, title);
          groups.set(groupKey, []);
        }
      }
    }

    // Assign fields to groups
    for (const field of fields) {
      if (field.key === 'SYSTEM_ENV_TEMPLATE_CONFIG') {
        continue;
      }
      const groupKey = this.assignFieldToGroup(field, {
        ...groupConfig.groups,
        ...autoDetectedGroups
      });
      if (groupKey && groups.has(groupKey)) {
        groups.get(groupKey)!.push(field);
        this.configService.debug(`Assigned ${field.key} to group: ${groupKey}`, this.serviceName);
      } else {
        ungrouped.push(field);
        this.configService.debug(`Field ${field.key} remains ungrouped`, this.serviceName);
      }
    }

    // Order groups logically
    const groupOrder = this.orderGroups(groups, groupConfig);

    const result: GroupedFields = {
      groups,
      ungrouped,
      groupTitles,
      groupOrder,
      groupInfo // <-- propagate full group info for output/prompting
    };

    this.configService.debug(
      `Grouping complete: ${groups.size} groups, ${ungrouped.length} ungrouped fields`,
      this.serviceName
    );

    return result;
  }

  public parseExplicitGroups(configString: string): Record<string, string> {
    this.configService.debug('Parsing explicit group configuration', this.serviceName);

    try {
      const config = JSON.parse(configString);
      if (config && typeof config === 'object' && config.groups) {
        this.configService.debug(
          `Parsed explicit groups: ${JSON.stringify(config.groups, null, 2)}`,
          this.serviceName
        );
        return config.groups;
      }
    } catch (error) {
      this.configService.debug(`Failed to parse group configuration: ${error}`, this.serviceName);
    }

    return {};
  }

  public extractGroupConfiguration(fields: TemplateField[]): GroupConfiguration | null {
    // Look for SYSTEM_ENV_TEMPLATE_CONFIG field
    const configField = fields.find(f => f.key === 'SYSTEM_ENV_TEMPLATE_CONFIG');
    if (!configField || !configField.options.value) {
      return null;
    }

    const explicitGroups = this.parseExplicitGroups(String(configField.options.value));
    
    return {
      groups: explicitGroups,
      autoDetect: Object.keys(explicitGroups).length === 0, // Only auto-detect if no explicit groups
      ungroupedTitle: 'General Configuration'
    };
  }

  public autoDetectGroups(fields: TemplateField[]): Record<string, string> {
    this.configService.debug('Auto-detecting groups from field prefixes', this.serviceName);

    const groupCounts = new Map<string, number>();
    const groups: Record<string, string> = {};

    // Count occurrences of potential group prefixes
    for (const field of fields) {
      if (field.key === 'SYSTEM_ENV_TEMPLATE_CONFIG') {
        continue; // Skip system config field
      }

      // Extract potential group prefix (everything before first underscore)
      const parts = field.key.split('_');
      if (parts.length > 1) {
        const prefix = parts[0];
        groupCounts.set(prefix, (groupCounts.get(prefix) || 0) + 1);
      }
    }

    // Only create groups for prefixes with 2+ fields
    for (const [prefix, count] of groupCounts) {
      if (count >= 2) {
        groups[prefix] = this.generateGroupTitle(prefix);
      }
    }

    this.configService.debug(
      `Auto-detected groups: ${JSON.stringify(groups, null, 2)}`,
      this.serviceName
    );

    return groups;
  }

  public generateGroupTitle(groupKey: string): string {
    // Special cases for common prefixes
    const specialCases: Record<string, string> = {
      'NEXT_PUBLIC': 'Next.js Public Configuration',
      'DATABASE': 'Database Configuration',
      'API': 'API Configuration',
      'AUTH': 'Authentication Configuration',
      'MAIL': 'Email Configuration',
      'REDIS': 'Redis Configuration',
      'AWS': 'AWS Configuration',
      'GOOGLE': 'Google Services Configuration',
      'GITHUB': 'GitHub Integration',
      'DOCKER': 'Docker Configuration'
    };

    if (specialCases[groupKey]) {
      return specialCases[groupKey];
    }

    // Generate title from key
    return groupKey
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ') + ' Configuration';
  }

  public orderGroups(groups: Map<string, TemplateField[]>, _config: GroupConfiguration): string[] {
    const groupNames = Array.from(groups.keys()).filter(name => groups.get(name)!.length > 0);
    
    return this.prioritizeGroups(groupNames);
  }

  public prioritizeGroups(groupNames: string[]): string[] {
    // Define priority order for common groups
    const priorityOrder = [
      'SYSTEM',
      'DATABASE',
      'API',
      'AUTH',
      'NEXT_PUBLIC',
      'WEB',
      'APP',
      'MAIL',
      'REDIS',
      'AWS',
      'GOOGLE',
      'GITHUB',
      'DOCKER'
    ];

    const prioritized: string[] = [];
    const remaining: string[] = [];

    // Add groups in priority order
    for (const priority of priorityOrder) {
      if (groupNames.includes(priority)) {
        prioritized.push(priority);
      }
    }

    // Add remaining groups alphabetically
    for (const name of groupNames) {
      if (!prioritized.includes(name)) {
        remaining.push(name);
      }
    }

    remaining.sort();

    const result = [...prioritized, ...remaining];
    
    this.configService.debug(
      `Group ordering: ${result.join(' -> ')}`,
      this.serviceName
    );

    return result;
  }

  public assignFieldToGroup(field: TemplateField, groups: Record<string, string>): string | null {
    // Check explicit group assignment first
    if (field.group && groups[field.group]) {
      return field.group;
    }

    // Check if field is explicitly assigned to a group in its options
    if (field.options.group && typeof field.options.group === 'string' && groups[field.options.group]) {
      return field.options.group;
    }

    // Try to match by prefix
    const fieldPrefix = field.key.split('_')[0];
    if (groups[fieldPrefix]) {
      return fieldPrefix;
    }

    return null;
  }

  public validateGroupConfiguration(config: GroupConfiguration): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate groups object
    if (!config.groups || typeof config.groups !== 'object') {
      errors.push('Groups configuration must be an object');
    } else {
      // Check for empty group names
      for (const [key, title] of Object.entries(config.groups)) {
        if (!key.trim()) {
          errors.push('Group keys cannot be empty');
        }
        if (!title.trim()) {
          warnings.push(`Group '${key}' has empty title`);
        }
      }
    }

    // Validate ungrouped title
    if (!config.ungroupedTitle || !config.ungroupedTitle.trim()) {
      warnings.push('Ungrouped title is empty, using default');
    }

    const result: ValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings
    };

    this.configService.debug(
      `Group configuration validation: ${result.valid ? 'PASSED' : 'FAILED'}`,
      this.serviceName
    );

    return result;
  }
}
