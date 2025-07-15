import * as prompts from "prompts";
import { default as pc } from "picocolors";
import type { TemplateField, PromptContext, PromptResult, TransformContext } from "../types/index.js";
import type { IPromptService, IValidationService, ITransformerService, IConfigService } from "../types/services.js";

export class PromptService implements IPromptService {
    /**
     * Evaluate template expressions like ${...} and $index in default values
     */
    public async evaluateTemplateExpression(expr: string, field: TemplateField, context: PromptContext): Promise<string> {
        // Support $index (field index in group or template)
        let index = 0;
        if (field && typeof field.lineNumber === 'number') {
            index = field.lineNumber - 1;
        }
        // Replace $index
        expr = expr.replace(/\$index/g, String(index));
        
        // Handle variable references using the transformer service
        if (expr.includes('@{') || expr.includes('${')) {
            const transformContext: TransformContext = {
                sourceValue: "",
                allValues: context.existingValues,
                field,
                templateFields: [],
                isVariableValue: true // Mark as variable value
            };
            
            try {
                const resolved = await this.transformerService.resolvePlaceholders(expr, transformContext);
                return resolved;
            } catch (error) {
                this.configService.debug(`Error resolving placeholders in default value: ${error}`, this.serviceName);
                return expr; // Return original if resolution fails
            }
        }
        
        // Replace ${...} with evaluated JS (for backward compatibility)
        expr = expr.replace(/\$\{([^}]+)\}/g, (_match, code) => {
            try {
                // Only allow numeric expressions for safety
                // eslint-disable-next-line no-new-func
                return Function('return (' + code + ')')();
            } catch {
                return '';
            }
        });
        return expr;
    }
    // For interface compatibility
    public displayGroupHeader(groupName: string, groupTitle: string): void {
        this.displayGroupHeaderWithDescription(groupName, groupTitle);
    }
    public readonly serviceName = "PromptService";

    constructor(
        private validationService: IValidationService,
        private transformerService: ITransformerService,
        private configService: IConfigService
    ) {}

    public async promptForField(field: TemplateField, context: PromptContext): Promise<PromptResult> {
        this.configService.debug(`Prompting for field: ${field.key}`, this.serviceName);

        // Check if we should skip this field
        if (this.shouldSkipField(field, context)) {
            const existingValue = context.existingValues.get(field.key) || "";
            this.configService.debug(`Skipping field ${field.key}: existing value found`, this.serviceName);
            return {
                value: existingValue,
                skipped: true,
                derived: false
            };
        }

        // Always attempt auto-derive if transformer is set
        if (field.options.transformer) {
            try {
                const baseContext: TransformContext = {
                    sourceValue: "",
                    allValues: context.existingValues,
                    field,
                    templateFields: [],
                    isVariableValue: true // Mark as variable value for transformation
                };

                const sourceValue = field.options.source
                    ? await this.transformerService.resolveSourceValue(field, baseContext)
                    : "";

                const transformContext: TransformContext = {
                    ...baseContext,
                    sourceValue
                };

                const derivedValue = await this.transformerService.applyTransformers(field, transformContext);
                this.configService.debug(`Auto-derived value for ${field.key}: ${derivedValue}`, this.serviceName);
                if (field.options.source) {
                    const sourceKey = String(field.options.source);
                    console.log(`Variable '${field.key}' was derived from '${sourceKey}'. Value: ${derivedValue}`);
                }
                if (derivedValue !== undefined && derivedValue !== null && String(derivedValue).trim() !== "") {
                    return {
                        value: derivedValue,
                        skipped: false,
                        derived: true
                    };
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown derivation error";
                this.configService.debug(`Auto-derivation failed for ${field.key}: ${message}`, this.serviceName);
                // Fall through to manual prompt
            }
        }

        // Manual prompt
        if (!context.interactive) {
            // Non-interactive mode: use default value or empty string
            let defaultValue = "";
            
            // Handle index-based defaults for select and multiselect fields
            if ((field.type === 'select' || field.type === 'multiselect') && typeof field.options.default === 'number') {
                const options = this.getFieldOptions(field);
                if (options && options.length > field.options.default && field.options.default >= 0) {
                    defaultValue = options[field.options.default];
                    this.configService.debug(`Resolved index-based default for ${field.key}: ${defaultValue} (index ${field.options.default})`, this.serviceName);
                } else {
                    defaultValue = String(field.options.default);
                }
            } else {
                defaultValue = String(field.options.value || field.options.default || "");
            }
            
            // Evaluate template expressions in defaultValue
            defaultValue = await this.evaluateTemplateExpression(defaultValue, field, context);
            return {
                value: defaultValue,
                skipped: false,
                derived: false
            };
        }
        return await this.promptWithValidation(field, context);
    }

    public async promptForGroup(groupName: string, fields: TemplateField[], context: PromptContext): Promise<Map<string, PromptResult>> {
        this.configService.debug(`Prompting for group: ${groupName} (${fields.length} fields)`, this.serviceName);

        // Sort fields so that any field referenced as a source comes before its dependents
        const fieldKeyToIndex = Object.fromEntries(fields.map((f, i) => [f.key, i]));
        const getDependencyKey = (field: TemplateField) => {
            if (field.options.source && typeof field.options.source === 'string') {
                // Remove braces for variable references
                return String(field.options.source).replace(/[@{}]/g, "");
            }
            if (field.options.from && typeof field.options.from === 'string') {
                return field.options.from;
            }
            return null;
        };
        const sortedFields = [...fields].sort((a, b) => {
            const aDep = getDependencyKey(a);
            const bDep = getDependencyKey(b);
            // If b depends on a, a comes first
            if (bDep && bDep === a.key) return -1;
            // If a depends on b, b comes first
            if (aDep && aDep === b.key) return 1;
            // Otherwise, preserve original order
            return fieldKeyToIndex[a.key] - fieldKeyToIndex[b.key];
        });

        const groupTitle = context.groupTitle || this.generateGroupTitle(groupName);
        let groupDescription = '';
        if ((context as any).groupInfo && (context as any).groupInfo.description) {
            groupDescription = (context as any).groupInfo.description;
        }
        this.displayGroupHeaderWithDescription(groupName, groupTitle, groupDescription);

        const results = new Map<string, PromptResult>();

        for (let i = 0; i < sortedFields.length; i++) {
            const field = sortedFields[i];
            try {
                const result = await this.promptForField(field, context);
                results.set(field.key, result);
                if (!result.skipped) {
                    context.existingValues.set(field.key, result.value);
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown prompt error";
                this.configService.debug(`Prompt error for ${field.key}: ${message}`, this.serviceName);
                results.set(field.key, {
                    value: "",
                    skipped: false,
                    derived: false,
                    error: message
                });
            }
        }

        return results;
    }

    public shouldSkipField(field: TemplateField, context: PromptContext): boolean {
        if (!context.skipExisting) {
            return false;
        }

        const existingValue = context.existingValues.get(field.key);
        return Boolean(existingValue && existingValue.trim());
    }

    public async shouldAutoDerive(field: TemplateField, context: PromptContext): Promise<boolean> {
        // Check if auto_derive is explicitly enabled
        if (field.options.auto_derive === true) {
            return true;
        }

        // Only auto-derive if transformer and source are set AND source value is available
        if (field.options.transformer && field.options.source) {
            const sourceKey = String(field.options.source).replace(/[@{}]/g, "");
            const hasSourceValue = context.existingValues.has(sourceKey);
            this.configService.debug(`Auto-derive check for ${field.key}: transformer=${field.options.transformer}, source=${field.options.source}, hasSourceValue=${hasSourceValue}`, this.serviceName);
            return hasSourceValue;
        }

        return false;
    }

    public generatePromptMessage(field: TemplateField): string {
        // Use custom message if provided
        if (field.options.message && typeof field.options.message === "string") {
            return field.options.message;
        }

        // Generate message based on field type and constraints
        let message = `Enter ${field.key.toLowerCase().replace(/_/g, " ")}`;

        // Add type information
        switch (field.type) {
            case "url":
                message += " (URL format)";
                break;
            case "email":
                message += " (email address)";
                break;
            case "port":
                message += " (port number)";
                break;
            case "number":
                message += " (number)";
                if (field.options.min || field.options.max) {
                    const { min, max } = field.options;
                    if (min && max) {
                        message += ` between ${min} and ${max}`;
                    } else if (min) {
                        message += ` (minimum: ${min})`;
                    } else if (max) {
                        message += ` (maximum: ${max})`;
                    }
                }
                break;
            case "boolean":
                message += " (true/false)";
                break;
        }

        // Add constraints information
        if (field.options.allow) {
            message += ` (allowed: ${field.options.allow})`;
        }

        return message;
    }

    public displayGroupHeaderWithDescription(_groupName: string, groupTitle: string, groupDescription?: string): void {
        const config = this.configService.getConfig();
        if (!config.interactive) {
            return;
        }
        console.log("\n" + pc.cyan("═".repeat(60)));
        console.log(pc.cyan(`  ${groupTitle}`));
        if (groupDescription) {
            console.log(pc.cyan(`  ${groupDescription}`));
        }
        console.log(pc.cyan("═".repeat(60)));
    }


    public displayValidationError(error: string): void {
        console.log(pc.red(`  ✗ ${error}`));
    }

    public displaySummary(results: Map<string, PromptResult>): void {
        const config = this.configService.getConfig();
        if (!config.interactive) {
            return;
        }

        let successful = 0;
        let skipped = 0;
        let derived = 0;
        let errors = 0;

        for (const result of results.values()) {
            if (result.error) {
                errors++;
            } else if (result.skipped) {
                skipped++;
            } else if (result.derived) {
                derived++;
            } else {
                successful++;
            }
        }

        console.log("\n" + pc.green("Configuration Summary:"));
        console.log(pc.green(`  ✓ Successfully configured: ${successful}`));
        if (derived > 0) {
            console.log(pc.blue(`  ⚡ Auto-derived: ${derived}`));
        }
        if (skipped > 0) {
            console.log(pc.yellow(`  ⏭ Skipped (existing): ${skipped}`));
        }
        if (errors > 0) {
            console.log(pc.red(`  ✗ Errors: ${errors}`));
        }
    }

    public async collectUserInput(field: TemplateField, message: string): Promise<string> {
      console.log(field)
        // Use promptParams from validator plugin if available
        let promptOptions: prompts.PromptObject = {
            type: this.getPromptType(field),
            name: "value",
            message: pc.white(message),
            initial: await this.getInitialValue(field)
        };

        // Get validator plugin for this field type
        let validatorPlugin;
        if (typeof (this.validationService as any).getRegisteredValidators === "function") {
            const plugins = (this.validationService as any).getRegisteredValidators();
            validatorPlugin = plugins.find((p: any) => p.name === field.type);
        }

        // If plugin has promptParams, override promptOptions
        if (validatorPlugin && validatorPlugin.promptParams) {
            const params = validatorPlugin.promptParams;
            if (params.type) promptOptions.type = params.type;
            if (params.message) promptOptions.message = pc.white(params.message);
            if (params.choices) promptOptions.choices = params.choices;
            if (params.format) promptOptions.format = params.format;
        }

        // Boolean labels support: labels param as "true=value,false=value"
        let booleanLabels: { trueLabel?: string; falseLabel?: string } = {};
        if (field.type === "boolean" && typeof field.options.labels === "string") {
            const labels = field.options.labels.split(",").map(l => l.trim());
            for (const label of labels) {
                const [key, value] = label.split("=").map(s => s.trim());
                if (key === "true") { booleanLabels.trueLabel = value; }
                if (key === "false") { booleanLabels.falseLabel = value; }
            }
        }

        // Always use confirm for boolean
        if (field.type === "boolean") {
            promptOptions.type = "confirm";
            // Set initial to true/false based on default
            let initial = String(field.options.value ?? field.options.default ?? "false").toLowerCase().trim();
            promptOptions.initial = initial === "true" || initial === "yes" || initial === "1" ? true : false;
        }

        try {
            console.log(pc.cyan(`\n${message}`));
            console.log(pc.cyan(`\nCurrent value: ${promptOptions.initial}`));
            console.log(promptOptions)
            const response = await prompts.default(promptOptions);

            console.log(pc.cyan(`\nYou entered: ${response.value}`));

            if (response.value === undefined) {
                // User cancelled (Ctrl+C)
                console.log(pc.yellow("\nPrompt cancelled by user. Exiting..."));
                process.exit(0);
            }

            // Transform value to label after prompt returns
            if (field.type === "boolean" && (booleanLabels.trueLabel || booleanLabels.falseLabel)) {
                if (response.value === true && booleanLabels.trueLabel) return booleanLabels.trueLabel;
                if (response.value === false && booleanLabels.falseLabel) return booleanLabels.falseLabel;
            }
            return field.type === "boolean" ? (response.value ? "true" : "false") : String(response.value);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Unknown input error";
            console.log(pc.red(`Input collection failed: ${msg}`));
            process.exit(1);
        }
    }

    public async validateAndRetry(field: TemplateField, _context: PromptContext): Promise<string> {
        const result = await this.promptWithValidation(field, _context);
        return result.value;
    }

    private async promptWithValidation(field: TemplateField, _context: PromptContext): Promise<PromptResult> {
        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                const message = this.generatePromptMessage(field);
                const input = await this.collectUserInput(field, message);

                // Validate input
                const validation = await this.validationService.validateField(input, field);

                if (validation.valid) {
                    return {
                        value: input,
                        skipped: false,
                        derived: false
                    };
                }

                // Display validation errors
                for (const error of validation.errors) {
                    this.displayValidationError(error);
                }

                attempt++;
                if (attempt >= maxRetries) {
                    throw new Error(`Validation failed after ${maxRetries} attempts`);
                }

                console.log(pc.yellow(`  Please try again (${maxRetries - attempt} attempts remaining)...`));
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown validation error";

                if (message.includes("User cancelled")) {
                    throw error; // Don't retry on user cancellation
                }

                attempt++;
                if (attempt >= maxRetries) {
                    throw new Error(`Prompt failed after ${maxRetries} attempts: ${message}`);
                }
            }
        }

        throw new Error("Maximum validation attempts exceeded");
    }

    public async processNonInteractive(fields: TemplateField[], defaultValues: Map<string, string>): Promise<Map<string, PromptResult>> {
        this.configService.debug("Processing fields in non-interactive mode", this.serviceName);

        const context: PromptContext = {
            existingValues: new Map(defaultValues),
            skipExisting: false,
            interactive: false
        };

        const results = new Map<string, PromptResult>();

        for (const field of fields) {
            const result = await this.promptForField(field, context);
            results.set(field.key, result);

            // Add to context for field dependencies
            context.existingValues.set(field.key, result.value);
        }

        return results;
    }

    private generateGroupTitle(groupName: string): string {
        return (
            groupName
                .split("_")
                .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                .join(" ") + " Configuration"
        );
    }

    private getPromptType(field: TemplateField): prompts.PromptType {
        // Use promptParams.type from validator plugin if available
        let validatorPlugin;
        if (typeof (this.validationService as any).getRegisteredValidators === "function") {
            const plugins = (this.validationService as any).getRegisteredValidators();
            validatorPlugin = plugins.find((p: any) => p.name === field.type);
        }
        if (validatorPlugin && validatorPlugin.promptParams && validatorPlugin.promptParams.type) {
            return validatorPlugin.promptParams.type;
        }
        return 'text'; // Default fallback
    }

    private async getInitialValue(field: TemplateField): Promise<string | number | undefined> {
        // Use value, or fallback to default
        let val: unknown = field.options.value;
        if (val === undefined || val === null || val === "") {
            val = field.options.default;
        }
        if (val === undefined || val === null || val === "") {
            return undefined;
        }

        // Handle index-based defaults for select and multiselect fields
        if ((field.type === 'select' || field.type === 'multiselect') && typeof val === 'number') {
            const options = this.getFieldOptions(field);
            if (options && options.length > val && val >= 0) {
                val = options[val]; // Convert index to actual value
                this.configService.debug(`Resolved index-based default for ${field.key}: ${val} (index ${field.options.default})`, this.serviceName);
            }
        }

        let value = String(val);
        // Parse template expressions in default value
        value = await this.evaluateTemplateExpression(value, field, { existingValues: new Map(), skipExisting: false, interactive: true });
        if (field.type === "number" || field.type === "port") {
            const num = parseFloat(value);
            return isNaN(num) ? undefined : num;
        }
        return value;
    }

    /**
     * Extract options array from field definition
     */
    private getFieldOptions(field: TemplateField): string[] | null {
        if (typeof field.options.options === 'string') {
            return field.options.options.split(',').map(v => v.trim());
        }
        if (Array.isArray(field.options.options)) {
            return field.options.options;
        }
        return null;
    }
}
