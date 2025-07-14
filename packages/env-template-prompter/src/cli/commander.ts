import { Command } from "commander";
import { EnvTemplatePrompter } from "../EnvTemplatePrompter.js";
import packageJson from "../../package.json";

const program = new Command();

program
    .name("env-prompt")
    .description("Interactive environment configuration from .env.template files")
    .version(packageJson.version)
    .option("-t, --template <file>", "Template file path", ".env.template")
    .option("-o, --output <file>", "Output file path", ".env")
    .option("-s, --skip-existing", "Skip fields that already have values", false)
    .option("-d, --debug", "Enable debug output", false)
    .option("-e, --env <env>", "Environment (prod, dev, staging, local)", "local")
    .action(async (options) => {
        let templatePath = options.template;
        const { env } = options;
        // If templatePath already ends with .<env>, don't double append
        if (env !== "local" && !templatePath.endsWith(`.${env}`)) {
            templatePath = `${templatePath}.${env}`;
        }

        const prompter = new EnvTemplatePrompter({
            templatePath,
            outputPath: options.output,
            debugMode: options.debug,
            skipExisting: options.skipExisting,
            interactive: true
        });
        const result = await prompter.processTemplate();
        if (result.success) {
            console.log(`\n✅ Successfully generated ${result.outputPath}`);
            console.log(`📊 Configured ${result.fieldCount} environment variables`);
            console.log(`⏱️  Processing time: ${result.duration}ms`);
            if (result.warnings.length > 0) {
                console.log(`\n⚠️  Warnings:`);
                for (const warning of result.warnings) {
                    console.log(`   ${warning}`);
                }
            }
        } else {
            console.error(`\n❌ Failed to generate environment file`);
            for (const error of result.errors) {
                console.error(`   ${error}`);
            }
            process.exit(1);
        }
    });

program.addCommand(
    new Command("check").description("Check the .env.template for groups and dependencies").action(async () => {
        const check = (await import("../commands/check.js")).default;
        await check();
    })
);

export default program;
