import type { EnvTemplatePrompterConfig, ProcessOptions, ProcessResult, TransformerPlugin, ValidatorPlugin, ServiceContainer, TemplateField, PromptContext, ValidationResult } from "./types/index.js";

import { ConfigService } from "./services/ConfigService.js";
import { TemplateParserService } from "./services/TemplateParserService.js";
import { ValidationService } from "./services/ValidationService.js";
import { TransformerService } from "./services/TransformerService.js";
import { GroupingService } from "./services/GroupingService.js";
import { PromptService } from "./services/PromptService.js";
import { OutputService } from "./services/OutputService.js";

export class EnvTemplatePrompter {
    private services: ServiceContainer;

    constructor(config: EnvTemplatePrompterConfig = {}) {
        this.services = this.createServices(config);

        // Register plugin transformers and validators if provided
        if (config.plugins?.transformers) {
            for (const transformer of config.plugins.transformers) {
                this.registerTransformer(transformer);
            }
        }

        if (config.plugins?.validators) {
            for (const validator of config.plugins.validators) {
                this.registerValidator(validator);
            }
        }

        this.services.configService.debug("EnvTemplatePrompter initialized", "EnvTemplatePrompter");
    }

    public async processTemplate(options: ProcessOptions = {}): Promise<ProcessResult> {
        const startTime = Date.now();
        this.services.configService.debug("Starting template processing", "EnvTemplatePrompter");

        const errors: string[] = [];
        const warnings: string[] = [];

        try {
            // Get configuration
            const config = this.services.configService.getConfig();
            const { templatePath } = config;

            // Parse template file
            this.services.configService.debug(`Parsing template: ${templatePath}`, "EnvTemplatePrompter");
            const fields = await this.services.templateParserService.parseTemplateFile(templatePath);

            if (fields.length === 0) {
                throw new Error("No fields found in template file");
            }

            // Validate template structure
            const templateValidation = this.services.templateParserService.validateTemplateStructure(fields);
            if (!templateValidation.valid) {
                errors.push(...templateValidation.errors);
                warnings.push(...templateValidation.warnings);

                if (templateValidation.errors.length > 0) {
                    throw new Error(`Template validation failed: ${templateValidation.errors.join(", ")}`);
                }
            }

            // Process fields to get values
            const values = await this.processFields(fields, options);

            // Generate output
            const outputContent = this.services.outputService.generateEnvFile(values, fields);
            const outputResult = await this.services.outputService.writeEnvFile(outputContent, config.outputPath);

            if (!outputResult.success) {
                errors.push(...outputResult.errors);
            }

            const duration = Date.now() - startTime;
            const result: ProcessResult = {
                success: errors.length === 0,
                fieldCount: fields.length,
                outputPath: config.outputPath,
                values,
                errors,
                warnings,
                duration
            };

            this.services.configService.debug(`Template processing ${result.success ? "completed" : "failed"} in ${duration}ms`, "EnvTemplatePrompter");

            return result;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown processing error";
            errors.push(message);

            const duration = Date.now() - startTime;
            return {
                success: false,
                fieldCount: 0,
                outputPath: this.services.configService.getConfig().outputPath,
                values: new Map(),
                errors,
                warnings,
                duration
            };
        }
    }

    public async processTemplateFile(path: string, options: ProcessOptions = {}): Promise<ProcessResult> {
        // Update template path and process
        this.services.configService.updateConfig({ templatePath: path });
        return this.processTemplate(options);
    }

    public registerTransformer(plugin: TransformerPlugin): void {
        this.services.transformerService.registerTransformer(plugin);
        this.services.configService.debug(`Registered transformer: ${plugin.name}`, "EnvTemplatePrompter");
    }

    public registerValidator(plugin: ValidatorPlugin): void {
        this.services.validationService.registerValidator(plugin);
        this.services.configService.debug(`Registered validator: ${plugin.name}`, "EnvTemplatePrompter");
    }

    public updateConfig(config: Partial<EnvTemplatePrompterConfig>): void {
        // Extract runtime config parts
        const runtimeConfig = {
            debugMode: config.debugMode,
            templatePath: config.templatePath,
            outputPath: config.outputPath,
            skipExisting: config.skipExisting,
            interactive: config.interactive
        };

        // Filter out undefined values
        const filteredConfig = Object.fromEntries(Object.entries(runtimeConfig).filter(([, value]) => value !== undefined));

        this.services.configService.updateConfig(filteredConfig);
        this.services.configService.debug("Configuration updated", "EnvTemplatePrompter");
    }

    public getConfig(): EnvTemplatePrompterConfig {
        const runtimeConfig = this.services.configService.getConfig();
        return {
            templatePath: runtimeConfig.templatePath,
            outputPath: runtimeConfig.outputPath,
            debugMode: runtimeConfig.debugMode,
            skipExisting: runtimeConfig.skipExisting,
            interactive: runtimeConfig.interactive
        };
    }

    public async validateTemplate(path: string): Promise<ValidationResult> {
        this.services.configService.debug(`Validating template: ${path}`, "EnvTemplatePrompter");

        try {
            const fields = await this.services.templateParserService.parseTemplateFile(path);
            return this.services.templateParserService.validateTemplateStructure(fields);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown validation error";
            return {
                valid: false,
                errors: [message],
                warnings: []
            };
        }
    }

    public async previewOutput(path: string, values: Map<string, string>): Promise<string> {
        this.services.configService.debug("Generating output preview", "EnvTemplatePrompter");

        try {
            const fields = await this.services.templateParserService.parseTemplateFile(path);
            return this.services.outputService.generateEnvFile(values, fields);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown preview error";
            throw new Error(`Preview generation failed: ${message}`);
        }
    }

    public getServices(): ServiceContainer {
        return this.services;
    }

    private createServices(config: EnvTemplatePrompterConfig): ServiceContainer {
        // Create services with dependency injection
        const configService = new ConfigService({
            debugMode: config.debugMode ?? false,
            templatePath: config.templatePath ?? ".env.template",
            outputPath: config.outputPath ?? ".env",
            skipExisting: config.skipExisting ?? false,
            interactive: config.interactive ?? true
        });

        const validationService = new ValidationService(configService);
        const transformerService = new TransformerService(configService);
        const templateParserService = new TemplateParserService(configService, validationService);
        const groupingService = new GroupingService(configService);
        const promptService = new PromptService(validationService, transformerService, configService);
        const outputService = new OutputService(configService);

        const serviceContainer = {
            configService,
            templateParserService,
            validationService,
            transformerService,
            groupingService,
            promptService,
            outputService
        };

        // Set cross-service references for variable validation and transformation
        validationService.setServiceContainer(serviceContainer);
        transformerService.setValidationService(validationService);

        return serviceContainer;
    }

    private async processFields(fields: TemplateField[], options: ProcessOptions): Promise<Map<string, string>> {
        this.services.configService.debug(`Processing ${fields.length} fields`, "EnvTemplatePrompter");

        // Group fields for better UX
        const groupedFields = this.services.groupingService.groupFields(fields);

        // Prepare context
        const context: PromptContext = {
            existingValues: new Map(options.defaultValues || []),
            skipExisting: options.skipExisting ?? this.services.configService.getConfig().skipExisting,
            interactive: options.interactive ?? this.services.configService.getConfig().interactive
        };

        const allResults = new Map<string, string>();

        // Log all group names and descriptions before prompting
        if (groupedFields.groupInfo && groupedFields.groupOrder.length > 0) {
            console.log("\n" + "=".repeat(60));
            console.log("Configuration Groups:");
            for (const groupName of groupedFields.groupOrder) {
                const info = groupedFields.groupInfo.get(groupName);
                if (info) {
                    console.log(`- ${info.name}${info.description ? ": " + info.description : ""}`);
                }
            }
            console.log("=".repeat(60) + "\n");
        }

        // Process ungrouped fields first
        if (groupedFields.ungrouped.length > 0) {
            this.services.configService.debug("Processing ungrouped fields", "EnvTemplatePrompter");
            for (const field of groupedFields.ungrouped) {
                const result = await this.services.promptService.promptForField(field, context);
                allResults.set(field.key, result.value);
                context.existingValues.set(field.key, result.value);
            }
        }

        // Process grouped fields
        for (const groupName of groupedFields.groupOrder) {
            const groupFields = groupedFields.groups.get(groupName);
            if (!groupFields || groupFields.length === 0) {
                continue;
            }

            const groupTitle = groupedFields.groupTitles.get(groupName);
            const groupInfo = groupedFields.groupInfo ? groupedFields.groupInfo.get(groupName) : undefined;
            const groupContext: PromptContext = {
                existingValues: context.existingValues,
                skipExisting: context.skipExisting,
                interactive: context.interactive,
                ...(groupTitle && { groupTitle }),
                ...(groupInfo && { groupInfo })
            };

            this.services.configService.debug(`Processing group: ${groupName} (${groupFields.length} fields)`, "EnvTemplatePrompter");

            const groupResults = await this.services.promptService.promptForGroup(groupName, groupFields, groupContext);

            // Add group results to overall results
            for (const [key, result] of groupResults) {
                allResults.set(key, result.value);
                context.existingValues.set(key, result.value);
            }
        }

        this.services.configService.debug(`Field processing complete: ${allResults.size} values collected`, "EnvTemplatePrompter");
        return allResults;
    }
}
