#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const crypto = require('crypto');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

// Debug flag - can be enabled via environment variable or command line argument
const DEBUG_MODE = process.env.INIT_DEBUG === 'true' || process.argv.includes('--debug');

// ANSI color codes for beautiful output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgBlue: '\x1b[44m',
    bgGreen: '\x1b[42m'
};

// Debug logging function
function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`${colors.dim}[${timestamp}] ${colors.cyan}🔍 DEBUG:${colors.reset} ${message}`);
        if (data !== null) {
            console.log(`${colors.dim}   Data:${colors.reset}`, typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
        }
    }
}

/**
 * Generate a random string of specified length
 */
function generateRandomString(length = 32) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * Validate URL based on template constraints
 */
function validateUrl(url, constraints = {}) {
    if (!url) {
        return 'URL is required';
    }
    
    try {
        const urlObj = new URL(url);
        
        // Check protocol constraints
        if (constraints.protocol) {
            const allowedProtocols = constraints.protocol.split(',').map(p => p.trim() + ':');
            if (!allowedProtocols.includes(urlObj.protocol)) {
                return `Protocol must be one of: ${constraints.protocol}`;
            }
        }
        
        // Check hostname constraints
        if (constraints.hostname) {
            const allowedHosts = constraints.hostname.split(',').map(h => h.trim());
            if (!allowedHosts.includes(urlObj.hostname)) {
                return `Hostname must be one of: ${constraints.hostname}`;
            }
        }
        
        // Check port constraints
        if (constraints.port && urlObj.port && constraints.port !== urlObj.port) {
            return `Port must be: ${constraints.port}`;
        }
        
        return true;
    } catch (error) {
        return 'Invalid URL format';
    }
}

/**
 * Validate number based on template constraints
 */
function validateNumber(value, constraints = {}) {
    const num = Number(value);
    
    if (isNaN(num)) {
        return 'Must be a valid number';
    }
    
    // Check if the value is in the allowed list (takes precedence over min/max)
    if (constraints.allow) {
        const allowedValues = constraints.allow.map(v => Number(v));
        if (allowedValues.includes(num)) {
            return true; // Value is explicitly allowed
        }
    }
    
    // Check min/max constraints
    if (constraints.min !== undefined && num < constraints.min) {
        const allowedText = constraints.allow ? ` or one of: ${constraints.allow.join(', ')}` : '';
        return `Must be at least ${constraints.min}${allowedText}`;
    }
    
    if (constraints.max !== undefined && num > constraints.max) {
        const allowedText = constraints.allow ? ` or one of: ${constraints.allow.join(', ')}` : '';
        return `Must be at most ${constraints.max}${allowedText}`;
    }
    
    return true;
}

/**
 * Validate string based on template constraints
 */
function validateString(value, constraints = {}) {
    if (!value && !constraints.optional) {
        return 'This field is required';
    }
    
    if (constraints.minLength && value.length < constraints.minLength) {
        return `Must be at least ${constraints.minLength} characters`;
    }
    
    if (constraints.maxLength && value.length > constraints.maxLength) {
        return `Must be at most ${constraints.maxLength} characters`;
    }
    
    if (constraints.pattern) {
        const regex = new RegExp(constraints.pattern);
        if (!regex.test(value)) {
            return `Must match pattern: ${constraints.pattern}`;
        }
    }
    
    return true;
}

/**
 * Validate date based on template constraints
 */
function validateDate(value, constraints = {}) {
    if (!value && constraints.optional) {
        return true;
    }
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return 'Invalid date format';
    }
    
    if (constraints.minDate && date < new Date(constraints.minDate)) {
        return `Date must be after ${constraints.minDate}`;
    }
    
    if (constraints.maxDate && date > new Date(constraints.maxDate)) {
        return `Date must be before ${constraints.maxDate}`;
    }
    
    return true;
}

/**
 * Parse template configuration from a template string
 */
function parseTemplate(templateStr) {
    debugLog('Parsing template string', templateStr);
    
    // Extract template configuration: {{type|param1=value1|param2=value2}}
    const match = templateStr.match(/^{{(.+)}}$/);
    if (!match) {
        debugLog('Template string does not match expected format');
        return null;
    }
    
    const parts = match[1].split('|');
    const type = parts[0].trim();
    const config = { type };
    
    debugLog('Template parts extracted', { type, parts: parts.slice(1) });
    
    // Parse parameters
    for (let i = 1; i < parts.length; i++) {
        const [key, value] = parts[i].split('=').map(s => s.trim());
        if (key && value !== undefined) {
            // Handle special value types
            if (value === 'true') {
                config[key] = true;
            } else if (value === 'false') {
                config[key] = false;
            } else if (key === 'options' || key === 'labels' || key === 'allow') {
                config[key] = value.split(',').map(s => s.trim());
            } else if (key === 'min' || key === 'max' || key === 'length' || key === 'minLength' || key === 'maxLength') {
                config[key] = parseInt(value);
            } else {
                config[key] = value;
            }
        }
    }
    
    debugLog('Template parsed successfully', config);
    return config;
}

/**
 * Convert template config to prompts config
 */
function createPromptConfig(key, template, context = {}) {
    // Apply transformers first
    const transformedTemplate = applyTransformers(template, context);
    
    // Skip if transformer determined it should be skipped
    if (transformedTemplate.skip) {
        return null;
    }
    
    const baseConfig = {
        name: key,
        message: transformedTemplate.label || key.replace(/_/g, ' ').toLowerCase(),
    };
    
    // Add description if available
    if (transformedTemplate.description) {
        baseConfig.message += `\n${colors.dim}${transformedTemplate.description}${colors.reset}`;
    }
    
    // Resolve variables in default value
    const resolvedDefault = transformedTemplate.default ? resolveVariables(transformedTemplate.default, context) : undefined;
    
    switch (transformedTemplate.type) {
        case 'string':
            return {
                ...baseConfig,
                type: transformedTemplate.secure ? 'password' : 'text',
                initial: transformedTemplate.generate === 'random' 
                    ? generateRandomString(transformedTemplate.length || 32)
                    : resolvedDefault || '',
                validate: (value) => validateString(value, transformedTemplate)
            };
            
        case 'number':
            return {
                ...baseConfig,
                type: 'number',
                initial: resolvedDefault !== undefined ? Number(resolvedDefault) : 0,
                validate: (value) => validateNumber(value, transformedTemplate)
            };
            
        case 'boolean':
            const labels = transformedTemplate.labels || ['true', 'false'];
            return {
                ...baseConfig,
                type: 'select',
                choices: [
                    { title: labels[0], value: true },
                    { title: labels[1], value: false }
                ],
                initial: resolvedDefault === labels[0] ? 0 : 1
            };
            
        case 'select':
            return {
                ...baseConfig,
                type: 'select',
                choices: (transformedTemplate.options || []).map(option => ({
                    title: option,
                    value: option
                })),
                initial: transformedTemplate.options ? transformedTemplate.options.indexOf(resolvedDefault) : 0
            };
            
        case 'multiselect':
            let choices;
            if (transformedTemplate.options && transformedTemplate.options.length > 0) {
                // Handle both array of strings and array of objects with title/value
                choices = transformedTemplate.options.map(option => {
                    if (typeof option === 'string') {
                        return {
                            title: option,
                            value: option,
                            selected: false
                        };
                    } else {
                        return {
                            title: option.title || option.value,
                            value: option.value,
                            selected: false
                        };
                    }
                });
            } else {
                choices = [];
            }
            
            return {
                ...baseConfig,
                type: 'multiselect',
                choices: choices,
                hint: `Use space to select, return to submit. Will be joined with '${transformedTemplate.separator || ','}'`
            };
            
        case 'url':
            return {
                ...baseConfig,
                type: 'text',
                initial: resolvedDefault || 'http://localhost:3000',
                validate: (value) => validateUrl(value, transformedTemplate)
            };
            
        case 'date':
            return {
                ...baseConfig,
                type: 'text',
                initial: resolvedDefault || new Date().toISOString().split('T')[0],
                validate: (value) => validateDate(value, transformedTemplate),
                format: (value) => {
                    if (transformedTemplate.format === 'YYYY-MM-DD') {
                        return new Date(value).toISOString().split('T')[0];
                    }
                    return value;
                }
            };
            
        case 'json':
            // JSON type for system configuration - usually skipped from prompts
            return {
                ...baseConfig,
                type: 'text',
                initial: resolvedDefault || '{}',
                validate: (value) => {
                    try {
                        JSON.parse(value);
                        return true;
                    } catch (error) {
                        return 'Please enter valid JSON';
                    }
                }
            };
            
        default:
            return {
                ...baseConfig,
                type: 'text',
                initial: resolvedDefault || ''
            };
    }
}

/**
 * Process multiselect values
 */
function processValue(value, template) {
    if (template.type === 'multiselect' && Array.isArray(value)) {
        return value.join(template.separator || ',');
    }
    
    if (template.type === 'boolean') {
        return value ? 'true' : 'false';
    }
    
    return value;
}

/**
 * Parse .env.template file using proper dotenv parser
 */
function parseEnvTemplate(templatePath) {
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
    }
    
    // Use dotenv to parse the file
    const result = dotenv.config({ path: templatePath });
    if (result.error) {
        throw new Error(`Error parsing template file: ${result.error.message}`);
    }
    
    const templates = {};
    const parsedEnv = result.parsed || {};
    
    for (const [key, value] of Object.entries(parsedEnv)) {
        const template = parseTemplate(value);
        if (template) {
            templates[key] = template;
        }
    }
    
    return templates;
}

/**
 * Intelligent grouping of environment variables by splitting on underscores
 * Groups variables with common prefixes into nested objects
 */
function groupEnvironmentVariables(templates) {
    debugLog('Starting environment variable grouping', { variableCount: Object.keys(templates).length });
    
    // Check if we have explicit group configuration
    const systemConfig = templates['SYSTEM_ENV_TEMPLATE_CONFIG'];
    let explicitGroups = null;
    
    if (systemConfig && systemConfig.default) {
        debugLog('Found SYSTEM_ENV_TEMPLATE_CONFIG', systemConfig.default);
        try {
            const config = JSON.parse(systemConfig.default);
            explicitGroups = config.groups;
            debugLog('Parsed explicit groups configuration', explicitGroups);
        } catch (error) {
            debugLog('Failed to parse SYSTEM_ENV_TEMPLATE_CONFIG JSON', error.message);
            console.log(`${colors.yellow}⚠️  Warning: Invalid SYSTEM_ENV_TEMPLATE_CONFIG JSON, falling back to auto-grouping${colors.reset}`);
        }
    }
    
    if (explicitGroups && Array.isArray(explicitGroups)) {
        debugLog('Using explicit groups configuration');
        // Use explicit groups configuration
        return groupByExplicitConfig(templates, explicitGroups);
    } else {
        debugLog('Using auto-detection grouping');
        // Fall back to current auto-grouping behavior
        return groupByAutoDetection(templates);
    }
}

/**
 * Group variables using explicit group configuration
 */
function groupByExplicitConfig(templates, groupsConfig) {
    debugLog('Grouping by explicit configuration', { groupCount: groupsConfig.length });
    
    const result = {};
    const usedVariables = new Set();
    
    // Create groups based on explicit configuration
    groupsConfig.forEach(groupDef => {
        const groupKey = groupDef.id;
        const groupVariables = {};
        
        debugLog(`Processing group: ${groupKey}`, groupDef);
        
        // Find all variables that belong to this group
        Object.keys(templates).forEach(varName => {
            const template = templates[varName];
            if (template.group === groupKey) {
                debugLog(`Variable ${varName} assigned to group ${groupKey}`);
                groupVariables[varName] = template;
                usedVariables.add(varName);
            }
        });
        
        // Only add group if it has variables
        if (Object.keys(groupVariables).length > 0) {
            debugLog(`Created group ${groupKey} with ${Object.keys(groupVariables).length} variables`);
            result[groupKey] = {
                ...groupVariables,
                _groupInfo: {
                    id: groupDef.id,
                    name: groupDef.name,
                    description: groupDef.description
                }
            };
        } else {
            debugLog(`Group ${groupKey} has no variables, skipping`);
        }
    });
    
    // Add ungrouped variables at root level
    const ungroupedCount = Object.keys(templates).length - usedVariables.size;
    debugLog(`Adding ${ungroupedCount} ungrouped variables to root level`);
    
    Object.keys(templates).forEach(varName => {
        if (!usedVariables.has(varName)) {
            debugLog(`Variable ${varName} added to root level (ungrouped)`);
            result[varName] = templates[varName];
        }
    });
    
    debugLog('Explicit grouping completed', { 
        totalGroups: Object.keys(result).filter(k => result[k]._groupInfo).length,
        ungroupedVariables: ungroupedCount 
    });
    
    return result;
}

/**
 * Group variables using auto-detection (fallback behavior)
 */
function groupByAutoDetection(templates) {
    const grouped = {};
    const variables = Object.keys(templates);
    
    // First, create a mapping of all possible groupings
    const groupings = new Map();
    
    variables.forEach(varName => {
        const parts = varName.split('_');
        
        // Try different grouping levels (2-way parent check)
        for (let depth = 1; depth <= Math.min(3, parts.length - 1); depth++) {
            const prefix = parts.slice(0, depth).join('_');
            const suffix = parts.slice(depth).join('_');
            
            if (!groupings.has(prefix)) {
                groupings.set(prefix, new Set());
            }
            groupings.get(prefix).add(varName);
        }
    });
    
    // Find the best groupings (groups with multiple variables)
    const usedVariables = new Set();
    const groups = [];
    
    // Sort by prefix length (longer prefixes first for specificity)
    const sortedPrefixes = Array.from(groupings.keys()).sort((a, b) => {
        // Prioritize by number of variables in group, then by prefix length
        const aCount = groupings.get(a).size;
        const bCount = groupings.get(b).size;
        if (aCount !== bCount) {
            return bCount - aCount;
        }
        return b.length - a.length;
    });
    
    for (const prefix of sortedPrefixes) {
        const vars = Array.from(groupings.get(prefix));
        
        // Only group if we have multiple variables and they're not already used
        if (vars.length > 1 && vars.some(v => !usedVariables.has(v))) {
            const availableVars = vars.filter(v => !usedVariables.has(v));
            if (availableVars.length > 1) {
                groups.push({ prefix, variables: availableVars });
                availableVars.forEach(v => usedVariables.add(v));
            }
        }
    }
    
    // Build the grouped structure
    const result = {};
    
    // Add grouped variables
    groups.forEach(({ prefix, variables }) => {
        const prefixParts = prefix.split('_');
        let current = result;
        
        // Create nested structure
        prefixParts.forEach((part, index) => {
            if (index === prefixParts.length - 1) {
                // Last part - create the group object
                if (!current[part]) {
                    current[part] = {};
                }
                variables.forEach(varName => {
                    const suffix = varName.substring(prefix.length + 1);
                    current[part][suffix] = templates[varName];
                });
            } else {
                // Intermediate part - create nested object
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
        });
    });
    
    // Add ungrouped variables at root level
    variables.forEach(varName => {
        if (!usedVariables.has(varName)) {
            result[varName] = templates[varName];
        }
    });
    
    return result;
}

/**
 * Flatten grouped variables back to flat structure for prompts
 */
function flattenGroupedVariables(grouped, prefix = '') {
    const flattened = {};
    
    for (const [key, value] of Object.entries(grouped)) {
        // Skip group info metadata
        if (key === '_groupInfo') {
            continue;
        }
        
        if (value && typeof value === 'object' && !value.type) {
            // It's a group, recurse
            const nestedFlattened = flattenGroupedVariables(value, prefix ? `${prefix}_${key}` : key);
            Object.assign(flattened, nestedFlattened);
        } else {
            // It's a template
            const fullKey = prefix ? `${prefix}_${key}` : key;
            flattened[fullKey] = value;
        }
    }
    
    return flattened;
}

/**
 * Extract port from URL
 */
function extractPortFromUrl(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.port) {
            return parseInt(urlObj.port);
        }
        // Return default ports for protocols
        return urlObj.protocol === 'https:' ? 443 : 80;
    } catch (error) {
        return null;
    }
}

/**
 * Transform values using built-in transformers
 */
function applyTransformers(template, context = {}) {
    if (!template.transformer) {
        return template;
    }

    const transformedTemplate = { ...template };
    
    switch (template.transformer) {
        case 'extract_port':
            debugLog(`Applying extract_port transformer`, { from: template.from, hasAnswers: !!context.answers });
            
            if (template.from && context.answers) {
                // Try to find the source value - check both direct key and grouped keys
                let sourceValue = context.answers[template.from];
                
                // If not found, try with group prefixes
                if (!sourceValue) {
                    for (const [key, value] of Object.entries(context.answers)) {
                        if (key.endsWith('_' + template.from) || key === template.from) {
                            sourceValue = value;
                            debugLog(`Found source value with grouped key: ${key}`);
                            break;
                        }
                    }
                }
                
                debugLog(`extract_port source resolution`, { 
                    sourceKey: template.from, 
                    sourceValue, 
                    availableKeys: Object.keys(context.answers) 
                });
                
                if (sourceValue) {
                    try {
                        const url = new URL(sourceValue);
                        debugLog(`URL parsed successfully`, { 
                            port: url.port, 
                            protocol: url.protocol, 
                            hostname: url.hostname 
                        });
                        
                        if (url.port) {
                            // Explicit port specified - auto-extract and skip prompt
                            transformedTemplate.default = url.port;
                            transformedTemplate.skip = true;
                            debugLog(`Port extracted and will skip prompt`, { port: url.port });
                        } else {
                            // No explicit port - provide default port based on protocol but still prompt
                            const defaultPort = url.protocol === 'https:' ? 443 : 80;
                            transformedTemplate.default = defaultPort.toString();
                            transformedTemplate.skip = false;
                            debugLog(`No explicit port, using protocol default`, { 
                                protocol: url.protocol, 
                                defaultPort 
                            });
                        }
                    } catch (error) {
                        debugLog(`URL parsing failed`, error.message);
                        // Keep original template if URL parsing fails
                    }
                } else {
                    debugLog(`No source value found for extract_port transformer`);
                }
            }
            break;
            
        case 'extract_hostname':
            debugLog(`Applying extract_hostname transformer`, { from: template.from });
            
            if (template.from && context.answers) {
                // Try to find the source value - check both direct key and grouped keys
                let sourceValue = context.answers[template.from];
                
                // If not found, try with group prefixes
                if (!sourceValue) {
                    for (const [key, value] of Object.entries(context.answers)) {
                        if (key.endsWith('_' + template.from) || key === template.from) {
                            sourceValue = value;
                            debugLog(`Found source value with grouped key: ${key}`);
                            break;
                        }
                    }
                }
                
                if (sourceValue) {
                    try {
                        const url = new URL(sourceValue);
                        transformedTemplate.default = url.hostname;
                        transformedTemplate.skip = template.skip_if_extracted !== false;
                        debugLog(`Hostname extracted`, { 
                            hostname: url.hostname, 
                            willSkip: transformedTemplate.skip 
                        });
                    } catch (error) {
                        debugLog(`URL parsing failed for hostname extraction`, error.message);
                    }
                }
            }
            break;
            
        case 'extract_protocol':
            debugLog(`Applying extract_protocol transformer`, { from: template.from });
            
            if (template.from && context.answers) {
                // Try to find the source value - check both direct key and grouped keys
                let sourceValue = context.answers[template.from];
                
                // If not found, try with group prefixes
                if (!sourceValue) {
                    for (const [key, value] of Object.entries(context.answers)) {
                        if (key.endsWith('_' + template.from) || key === template.from) {
                            sourceValue = value;
                            debugLog(`Found source value with grouped key: ${key}`);
                            break;
                        }
                    }
                }
                
                if (sourceValue) {
                    try {
                        const url = new URL(sourceValue);
                        transformedTemplate.default = url.protocol.replace(':', '');
                        transformedTemplate.skip = template.skip_if_extracted !== false;
                        debugLog(`Protocol extracted`, { 
                            protocol: url.protocol, 
                            cleaned: transformedTemplate.default,
                            willSkip: transformedTemplate.skip 
                        });
                    } catch (error) {
                        debugLog(`URL parsing failed for protocol extraction`, error.message);
                    }
                }
            }
            break;
            
        case 'derive_url':
            if (template.base_url && template.port_from && context.answers) {
                const baseUrl = context.answers[template.base_url];
                const port = context.answers[template.port_from];
                if (baseUrl && port) {
                    try {
                        const url = new URL(baseUrl);
                        url.port = port.toString();
                        transformedTemplate.default = url.toString();
                        transformedTemplate.skip = template.skip_if_derived !== false;
                    } catch (error) {
                        // Keep original template if URL construction fails
                    }
                }
            }
            break;
            
        case 'reference':
            if (template.from && context.answers && context.answers[template.from]) {
                transformedTemplate.default = context.answers[template.from];
                transformedTemplate.skip = template.skip_if_referenced !== false;
            }
            break;
            
        case 'cors_origins':
            // Dynamically build CORS origins from configured URLs
            if (context.answers) {
                // Parse from_urls parameter - handle both string and array
                let urlKeys = template.from_urls || ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_APP_URL'];
                if (typeof urlKeys === 'string') {
                    urlKeys = urlKeys.split(',').map(key => key.trim());
                }
                
                const dynamicOptions = [];
                
                urlKeys.forEach(urlKey => {
                    // Try to find the source value - check both direct key and grouped keys
                    let sourceValue = context.answers[urlKey];
                    
                    // If not found, try with group prefixes
                    if (!sourceValue) {
                        for (const [key, value] of Object.entries(context.answers)) {
                            if (key.endsWith('_' + urlKey) || key === urlKey) {
                                sourceValue = value;
                                break;
                            }
                        }
                    }
                    
                    if (sourceValue) {
                        try {
                            const url = new URL(sourceValue);
                            const origin = `${url.protocol}//${url.hostname}${url.port && !['80', '443'].includes(url.port) ? ':' + url.port : ''}`;
                            
                            // Add descriptive label
                            let label;
                            if (urlKey.includes('API')) {
                                label = 'API URL';
                            } else if (urlKey.includes('APP') || urlKey.includes('WEB')) {
                                label = 'Web App URL';
                            } else {
                                label = urlKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            }
                            
                            dynamicOptions.push({
                                title: `(${label}) => ${origin}`,
                                value: origin
                            });
                        } catch (error) {
                            // Skip invalid URLs
                        }
                    }
                });
                
                // Add any static options from template
                const staticOptions = (template.options || []).map(option => ({
                    title: option,
                    value: option
                }));
                
                transformedTemplate.options = [...dynamicOptions, ...staticOptions];
            }
            break;
    }
    
    return transformedTemplate;
}

/**
 * Resolve variables in default values (like $index) and variable references
 */
function resolveVariables(value, context = {}) {
    if (typeof value !== 'string') {
        return value;
    }
    
    // First resolve references to other variables using @{varname} syntax
    let resolved = value.replace(/@\{([^}]+)\}/g, (match, varName) => {
        if (context.answers && context.answers[varName] !== undefined) {
            return context.answers[varName];
        }
        console.warn(`Warning: Referenced variable "${varName}" not found in context`);
        return match;
    });
    
    // Then resolve expressions using ${expression} syntax
    resolved = resolved.replace(/\$\{([^}]+)\}/g, (match, expression) => {
        try {
            // Create a safe evaluation context
            const evalContext = {
                ...context,
                Date: Date,
                Math: Math,
                parseInt: parseInt,
                parseFloat: parseFloat
            };
            
            // Replace variables in the expression
            let processedExpression = expression;
            for (const [key, val] of Object.entries(evalContext)) {
                const regex = new RegExp(`\\$${key}\\b`, 'g');
                processedExpression = processedExpression.replace(regex, val);
            }
            
            // Safely evaluate the expression
            return Function('"use strict"; return (' + processedExpression + ')')();
        } catch (error) {
            console.warn(`Warning: Could not resolve variable expression "${expression}":`, error.message);
            return match; // Keep original if evaluation fails
        }
    });
    
    return resolved;
}

/**
 * Main initialization function
 */
async function init() {
    debugLog('Starting initialization process');
    
    if (DEBUG_MODE) {
        console.log(`${colors.bright}${colors.yellow}🔧 DEBUG MODE ENABLED${colors.reset}`);
        console.log(`${colors.dim}Use INIT_DEBUG=true or --debug to enable debug output${colors.reset}\n`);
    }
    
    console.log(`${colors.bgBlue}${colors.white} 🚀 NextJS Directus Turborepo Initialization ${colors.reset}\\n`);
    
    const templatePath = '.env.template';
    const envPath = '.env';
    
    // Check if already initialized
    if (fs.existsSync(envPath)) {
        const { overwrite } = await prompts({
            type: 'confirm',
            name: 'overwrite',
            message: `${colors.yellow}⚠️  .env file already exists. Overwrite?${colors.reset}`,
            initial: false
        });
        
        if (!overwrite) {
            console.log(`${colors.green}✅ Initialization cancelled${colors.reset}`);
            return;
        }
    }
    
    try {
        console.log(`${colors.cyan}📋 Parsing configuration template...${colors.reset}`);
        const templates = parseEnvTemplate(templatePath);
        debugLog('Template parsing completed', { templateCount: Object.keys(templates).length });

        if (Object.keys(templates).length === 0) {
            throw new Error('No valid templates found in .env.template');
        }
        
        console.log(`${colors.cyan}🔄 Grouping environment variables...${colors.reset}`);
        const groupedTemplates = groupEnvironmentVariables(templates);
        debugLog('Variable grouping completed');
        
        console.log(`${colors.green}✅ Found ${Object.keys(templates).length} configuration options${colors.reset}`);
        
        if (DEBUG_MODE) {
            console.log(`${colors.blue}📊 Grouped structure:${colors.reset}`);
            console.log(JSON.stringify(groupedTemplates, null, 2));
        }
        console.log('');
        
        // Flatten back for prompts but maintain order information
        const flatTemplates = flattenGroupedVariables(groupedTemplates);
        debugLog('Templates flattened for prompting', { flatCount: Object.keys(flatTemplates).length });
        
        const answers = {};
        const templateMap = {};
        let index = 0;
        let currentGroup = null;
        
        debugLog('Building group lookup for explicit groups');
        const groupLookup = new Map();
        Object.keys(groupedTemplates).forEach(groupKey => {
            const group = groupedTemplates[groupKey];
            if (group && group._groupInfo) {
                debugLog(`Group ${groupKey} has explicit info`, group._groupInfo);
                // Map each variable in the group to its group info
                Object.keys(group).forEach(varKey => {
                    if (varKey !== '_groupInfo') {
                        groupLookup.set(varKey, group._groupInfo);
                        debugLog(`Mapped variable ${varKey} to group ${groupKey}`);
                    }
                });
            }
        });
        
        debugLog('Starting prompt processing loop', { totalVariables: Object.keys(flatTemplates).length });
        
        // Process variables in order, allowing transformers to reference previous answers
        for (const [key, template] of Object.entries(flatTemplates)) {
            debugLog(`Processing variable: ${key}`, { 
                type: template.type, 
                group: template.group, 
                optional: template.optional 
            });
            
            if (!template.optional || template.required !== false) {
                templateMap[key] = template;
                
                // Check if we're entering a new group and display group title
                let groupName = null;
                let groupDisplayName = null;
                let groupDescription = null;
                
                // Check if this variable has explicit group info
                if (groupLookup.has(key)) {
                    const groupInfo = groupLookup.get(key);
                    groupName = groupInfo.id;
                    groupDisplayName = groupInfo.name;
                    groupDescription = groupInfo.description;
                } else {
                    // Fall back to auto-detection for ungrouped variables
                    const keyParts = key.split('_');
                    if (keyParts.length > 1) {
                        // Determine the actual group name - check for NEXT_PUBLIC prefix
                        if (keyParts[0] === 'NEXT' && keyParts[1] === 'PUBLIC') {
                            groupName = 'NEXT_PUBLIC';
                            groupDisplayName = 'NEXT PUBLIC';
                        } else {
                            groupName = keyParts[0];
                            groupDisplayName = groupName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        }
                    }
                }
                
                // Display group title if we're entering a new group
                if (groupName && currentGroup !== groupName) {
                    currentGroup = groupName;
                    console.log(`\n${colors.bright}${colors.blue}📦 ${groupDisplayName} Configuration${colors.reset}`);
                    if (groupDescription) {
                        console.log(`${colors.dim}${groupDescription}${colors.reset}`);
                    }
                    console.log(`${colors.dim}${'─'.repeat(40)}${colors.reset}\n`);
                }
                
                const context = { 
                    index: index++,
                    total: Object.keys(flatTemplates).length,
                    key: key,
                    answers: answers
                };
                
                // Handle skip_export variables - process default values but don't prompt
                if (template.skip_export === true || template.skip_export === 'true') {
                    if (template.default !== undefined) {
                        const resolvedDefault = resolveVariables(template.default, context);
                        answers[key] = processValue(resolvedDefault, template);
                        console.log(`${colors.green}✓ ${colors.dim}${key}: (system configuration - not exported)${colors.reset}`);
                    }
                    continue;
                }
                
                const promptConfig = createPromptConfig(key, template, context);
                
                // Skip if transformer determined it should be skipped
                if (promptConfig === null) {
                    // Apply the transformed value directly
                    const transformedTemplate = applyTransformers(template, context);
                    if (transformedTemplate.default !== undefined) {
                        const resolvedDefault = resolveVariables(transformedTemplate.default, context);
                        answers[key] = processValue(resolvedDefault, transformedTemplate);
                        
                        // Show different messages based on transformer type
                        if (template.from) {
                            console.log(`${colors.green}✓ ${colors.dim}${key}: ${answers[key]} (auto-derived from ${template.from} using ${colors.reset}${colors.magenta}${transformedTemplate.transformer}${colors.reset}${colors.green})${colors.reset}`);
                        } else {
                            console.log(`${colors.green}✓ ${colors.dim}${key}: ${answers[key]} (auto-derived using ${colors.reset}${colors.magenta}${transformedTemplate.transformer}${colors.reset}${colors.green})${colors.reset}`);
                        }
                    }
                    continue;
                }
                
                // Check if this was transformed and show helpful message
                const transformedTemplate = applyTransformers(template, context);
                if (transformedTemplate.transformer && transformedTemplate.default && !transformedTemplate.skip) {
                    if (transformedTemplate.transformer === 'extract_port') {
                        console.log(`${colors.cyan}💡 ${colors.dim}Default port suggested for ${key} (no explicit port in ${template.from})${colors.reset}`);
                    } else {
                        console.log(`${colors.cyan}💡 ${colors.dim}Auto-suggested value for ${key} based on ${template.from || 'previous input'}${colors.reset}`);
                    }
                }
                
                // Run individual prompt
                const result = await prompts(promptConfig, {
                    onCancel: () => {
                        console.log(`\n${colors.red}❌ Initialization cancelled${colors.reset}`);
                        process.exit(1);
                    }
                });
                
                if (result[key] !== undefined) {
                    answers[key] = result[key];
                }
            }
        }
        
        // Process answers and create .env content
        let envContent = `# Generated by NextJS Directus Turborepo Init\\n# Generated on: ${new Date().toISOString()}\\n\\n`;
        
        // Build sections based on grouped structure
        function buildEnvSections(grouped, prefix = '', depth = 0) {
            const sections = [];
            
            for (const [key, value] of Object.entries(grouped)) {
                // Skip group info metadata
                if (key === '_groupInfo') {
                    continue;
                }
                
                if (value && typeof value === 'object' && !value.type) {
                    // It's a group
                    const sectionName = key.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
                    const indent = '  '.repeat(depth);
                    sections.push(`${indent}# ${sectionName} Configuration`);
                    
                    const nestedSections = buildEnvSections(value, prefix ? `${prefix}_${key}` : key, depth + 1);
                    sections.push(...nestedSections);
                    sections.push('');
                } else {
                    // It's a template
                    const fullKey = prefix ? `${prefix}_${key}` : key;
                    if (answers.hasOwnProperty(fullKey)) {
                        const template = templateMap[fullKey];
                        
                        // Skip variables marked as skip_export
                        if (template.skip_export === true || template.skip_export === 'true') {
                            continue;
                        }
                        
                        const processedValue = processValue(answers[fullKey], template);
                        sections.push(`${fullKey}=${processedValue}`);
                    }
                }
            }
            
            return sections;
        }
        
        const envSections = buildEnvSections(groupedTemplates);
        envContent += envSections.join('\\n');
        
        // Write .env file
        fs.writeFileSync(envPath, envContent);
        
        console.log(`\\n${colors.bgGreen}${colors.white} ✅ Configuration completed successfully! ${colors.reset}\\n`);
        console.log(`${colors.green}📄 Created .env file with your configuration${colors.reset}`);
        console.log(`${colors.cyan}🔧 You can now run: bun run dev${colors.reset}\\n`);
        
        // Show next steps
        console.log(`${colors.bright}${colors.blue}📋 Next Steps:${colors.reset}`);
        console.log(`${colors.dim}1. Review the generated .env file${colors.reset}`);
        console.log(`${colors.dim}2. Start development: bun run dev${colors.reset}`);
        console.log(`${colors.dim}3. Access your apps:${colors.reset}`);
        console.log(`${colors.dim}   • API: ${answers.NEXT_PUBLIC_API_URL || 'http://localhost:8055'}${colors.reset}`);
        console.log(`${colors.dim}   • Web: ${answers.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}${colors.reset}\\n`);
        
    } catch (error) {
        console.error(`${colors.red}❌ Error during initialization:${colors.reset}`, error.message);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log(`\\n${colors.yellow}⚠️  Initialization interrupted${colors.reset}`);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log(`\\n${colors.yellow}⚠️  Initialization terminated${colors.reset}`);
    process.exit(1);
});

// Run initialization
if (require.main === module) {
    // Show help if requested
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
        console.log(`${colors.bright}NextJS Directus Turborepo Initialization${colors.reset}`);
        console.log('');
        console.log('Usage: bun scripts/init.js [options]');
        console.log('');
        console.log('Options:');
        console.log('  --debug      Enable debug output');
        console.log('  --help, -h   Show this help message');
        console.log('');
        console.log('Environment Variables:');
        console.log('  INIT_DEBUG=true  Enable debug output');
        process.exit(0);
    }
    
    init().catch(error => {
        console.error(`${colors.red}❌ Fatal error:${colors.reset}`, error);
        process.exit(1);
    });
}

module.exports = { 
    init, 
    parseTemplate, 
    validateUrl, 
    validateNumber, 
    generateRandomString, 
    applyTransformers, 
    extractPortFromUrl 
};
