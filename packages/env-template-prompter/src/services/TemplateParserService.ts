import { readFile } from "fs/promises";
import { existsSync } from "fs";
import type { TemplateField, ValidationResult } from "../types/index.js";
import type { ITemplateParserService, IConfigService, IValidationService } from "../types/services.js";

export class TemplateParserService implements ITemplateParserService {
    public readonly serviceName = "TemplateParserService";

    constructor(
        private configService: IConfigService,
        private validationService: IValidationService
    ) {}

    public parseTemplate(content: string): TemplateField[] {
        this.configService.debug("Starting template parsing", this.serviceName);

        const lines = content.split("\n");
        const fields: TemplateField[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;

            // Skip empty lines and comments (unless they're field definitions)
            if (!line || (line.startsWith("#") && !line.includes("{{"))) {
                continue;
            }

            const field = this.extractFieldDefinition(line);
            if (field) {
                field.lineNumber = lineNumber;
                fields.push(field);
                this.configService.debug(`Parsed field: ${field.key} (type: ${field.type}, line: ${lineNumber})`, this.serviceName);
            }
        }

        this.configService.debug(`Template parsing complete. Found ${fields.length} fields`, this.serviceName);
        return fields;
    }

    public async parseTemplateFile(filePath: string): Promise<TemplateField[]> {
        this.configService.debug(`Reading template file: ${filePath}`, this.serviceName);

        if (!existsSync(filePath)) {
            throw new Error(`Template file not found: ${filePath}`);
        }

        try {
            const content = await readFile(filePath, "utf-8");
            return this.parseTemplate(content);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            this.configService.debug(`Failed to read template file: ${message}`, this.serviceName);
            throw new Error(`Failed to read template file: ${message}`);
        }
    }

    public extractFieldDefinition(line: string): TemplateField | null {
        // Match pattern: KEY={{type|param=value|param2=value2}} (allow whitespace and mixed case)
        const fieldRegex = /^\s*([A-Za-z0-9_\- ]+?)\s*=\s*\{\{(.*?)\}\}(?:\s*#.*)?$/;
        const match = line.match(fieldRegex);

        if (!match) {
            return null;
        }

        const [, keyRaw, optionsString] = match;
        const key = keyRaw.trim().replace(/\s+/g, "_").toUpperCase();
        const options = this.parseFieldOptions(optionsString);

        // Extract type (first part before any |)
        const typeMatch = optionsString.match(/^([^|]+)/);
        const type = this.parseFieldType(typeMatch?.[1]?.trim() || "string");

        const field: TemplateField = {
            key,
            type,
            options,
            rawLine: line,
            lineNumber: 0 // Will be set by parseTemplate
        };

        // Set group from options if specified
        if (options.group && typeof options.group === "string") {
            field.group = options.group;
        }

        return field;
    }

    public parseFieldOptions(optionsString: string): Record<string, unknown> {
        const options: Record<string, unknown> = {};
        // Split by | but ignore | inside quotes
        const parts = optionsString.match(/(?:[^|"']+|"[^"]*"|'[^']*')+/g) || [];
        // First part is always the type
        if (parts.length > 0) {
            options.type = parts[0]?.trim();
        }
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            const eqIndex = part.indexOf("=");
            if (eqIndex === -1) {
                // Boolean flag (no value)
                options[part.trim()] = true;
            } else {
                const key = part.substring(0, eqIndex).trim();
                let value: string | number | boolean = part.substring(eqIndex + 1).trim();
                // Remove surrounding quotes if present
                value = value.replace(/^"|"$/g, "").replace(/^'|'$/g, "");
                // Try to parse numbers and booleans
                if (/^\d+$/.test(value)) {
                    value = Number(value);
                }
                if (value === "true") {
                    value = true;
                }
                if (value === "false") {
                    value = false;
                }
                options[key] = value;
            }
        }
        this.configService.debug(`Parsed field options: ${JSON.stringify(options, null, 2)}`, this.serviceName);
        return options;
    }
    
    public getValidFieldTypes(): string[] {
        // Use all registered validator plugin names as valid types
        const plugins = this.validationService.getRegisteredValidators();
        const validTypes: string[] = ["string", "number", "boolean", "url", "email", "port", ...plugins.map((p: any) => p.name)];
        return validTypes as string[];
    }

    public parseFieldType(type: string): string {
        return this.getValidFieldTypes().includes(type) ? type as string : "string";
    }

    public validateTemplateStructure(fields: TemplateField[]): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];
        const seenKeys = new Set<string>();

        // Get valid types from plugin validator
        let validTypes: string[] = this.getValidFieldTypes();

        for (const field of fields) {
            // Check for duplicate keys
            if (seenKeys.has(field.key)) {
                errors.push(`Duplicate field key: ${field.key} (line ${field.lineNumber})`);
            } else {
                seenKeys.add(field.key);
            }

            // Validate field types
            if (!validTypes.includes(field.type)) {
                errors.push(`Invalid field type '${field.type}' for ${field.key} (line ${field.lineNumber})`);
            }

            // Check transformer references
            if (field.options.transformer && field.options.source) {
                const sourceKey = String(field.options.source).replace(/[@{}]/g, "");
                if (!seenKeys.has(sourceKey) && !fields.some((f) => f.key === sourceKey)) {
                    warnings.push(`Transformer source '${sourceKey}' for ${field.key} not found (line ${field.lineNumber})`);
                }
            }

            // Validate numeric constraints
            if (field.type === "number") {
                const { min, max } = field.options;
                if (typeof min === "number" && typeof max === "number" && min > max) {
                    errors.push(`Invalid range: min (${min}) > max (${max}) for ${field.key} (line ${field.lineNumber})`);
                }
            }
        }

        const result: ValidationResult = {
            valid: errors.length === 0,
            errors,
            warnings
        };

        this.configService.debug(`Template structure validation: ${result.valid ? "PASSED" : "FAILED"} (${errors.length} errors, ${warnings.length} warnings)`, this.serviceName);

        return result;
    }

    public resolveIncludes(content: string): string {
        // Simple include resolution for future extensibility
        // Pattern: # @include path/to/file.template
        return content.replace(/^# @include (.+)$/gm, (_match, includePath) => {
            this.configService.debug(`Include found but not yet implemented: ${includePath}`, this.serviceName);
            return `# Include: ${includePath.trim()} (not implemented)`;
        });
    }

    public extractComments(content: string): Map<string, string> {
        const comments = new Map<string, string>();
        const lines = content.split("\n");

        let currentComment = "";
        for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith("#") && !trimmedLine.includes("{{")) {
                // Regular comment line
                currentComment += (currentComment ? "\n" : "") + trimmedLine.substring(1).trim();
            } else if (trimmedLine.includes("{{") && currentComment) {
                // Field definition with accumulated comment
                const keyMatch = trimmedLine.match(/^([A-Z_][A-Z0-9_]*)=/);
                if (keyMatch) {
                    comments.set(keyMatch[1], currentComment);
                    currentComment = "";
                }
            } else if (trimmedLine && !trimmedLine.startsWith("#")) {
                // Non-comment, non-field line resets comment accumulation
                currentComment = "";
            }
        }

        this.configService.debug(`Extracted ${comments.size} field comments`, this.serviceName);
        return comments;
    }
}
