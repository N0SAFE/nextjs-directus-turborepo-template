import type { RuntimeConfig, ValidationResult, DebugHandler } from "../types/index.js";
import type { IConfigService } from "../types/services.js";

export class ConfigService implements IConfigService {
    public get serviceName() {
        return "ConfigService";
    }

    private config: RuntimeConfig;
    private debugHandlers: Set<DebugHandler> = new Set();

    constructor(initialConfig: Partial<RuntimeConfig> = {}) {
        this.config = {
            debugMode: false,
            templatePath: ".env.template",
            outputPath: ".env",
            skipExisting: false,
            interactive: true,
            ...initialConfig
        };
    }

    public setDebugMode(enabled: boolean): void {
        this.config.debugMode = enabled;
        this.debug(`Debug mode ${enabled ? "enabled" : "disabled"}`, "ConfigService");
    }

    public getConfig(): RuntimeConfig {
        return { ...this.config };
    }

    public updateConfig(partial: Partial<RuntimeConfig>): void {
        const oldConfig = { ...this.config };
        this.config = { ...this.config, ...partial };

        this.debug(
            `Configuration updated: ${JSON.stringify(
                {
                    old: oldConfig,
                    new: this.config,
                    changes: partial
                },
                null,
                2
            )}`,
            "ConfigService"
        );
    }

    public debug(message: string, context = "General"): void {
        if (!this.config.debugMode) {
            return;
        }

        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] [${context}] ${message}`;

        // Always call all registered handlers
        let handlerCalled = false;
        this.debugHandlers.forEach((handler) => {
            handlerCalled = true;
            try {
                handler(formattedMessage, context);
            } catch (error) {
                // Log error message exactly as thrown for test compatibility
                if (error instanceof Error) {
                    console.error("Debug handler error:", error.message);
                } else if (typeof error === "string") {
                    console.error("Debug handler error:", error);
                } else {
                    console.error("Debug handler error:", String(error));
                }
            }
        });
        // If no custom handlers, use console.log
        if (!handlerCalled) {
            console.log(`\x1b[36m${formattedMessage}\x1b[0m`);
        }
    }

    public addDebugHandler(handler: DebugHandler): void {
        this.debugHandlers.add(handler);
        try {
            // Only call handler when added, not debug
            handler(`[${new Date().toISOString()}] [ConfigService] Debug handler added (total: ${this.debugHandlers.size})`, "ConfigService");
        } catch (error) {
            // Log error message exactly as thrown for test compatibility
            if (error instanceof Error) {
                console.error("Debug handler error:", error.message);
            } else if (typeof error === "string") {
                console.error("Debug handler error:", error);
            } else {
                console.error("Debug handler error:", String(error));
            }
        }
    }

    public removeDebugHandler(handler: DebugHandler): void {
        const removed = this.debugHandlers.delete(handler);

        if (removed) {
            try {
                // Only call handler when removed, not debug
                handler(`[${new Date().toISOString()}] [ConfigService] Debug handler removed (total: ${this.debugHandlers.size})`, "ConfigService");
            } catch (error) {
                // Log error message exactly as thrown for test compatibility
                if (error instanceof Error) {
                    console.error("Debug handler error:", error.message);
                } else if (typeof error === "string") {
                    console.error("Debug handler error:", error);
                } else {
                    console.error("Debug handler error:", String(error));
                }
            }
        }
    }

    public validateConfig(): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validate template path
        if (!this.config.templatePath) {
            errors.push("Template path is required");
        } else if (!this.config.templatePath.endsWith(".template")) {
            warnings.push("Template path does not end with .template extension");
        }

        // Validate output path
        if (!this.config.outputPath) {
            errors.push("Output path is required");
        }

        // Validate paths are different
        if (this.config.templatePath === this.config.outputPath) {
            errors.push("Template path and output path cannot be the same");
        }

        const result: ValidationResult = {
            valid: errors.length === 0,
            errors,
            warnings
        };

        this.debug(`Configuration validation result: ${JSON.stringify(result, null, 2)}`, "ConfigService");

        return result;
    }
}
