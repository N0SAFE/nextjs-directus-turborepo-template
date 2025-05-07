import { Command } from "commander";
import { SharedDependencyService } from "../services/shared/SharedDependency.service";
import { ConfigManager } from "../config/ConfigManager";
import * as path from "path";

export function registerSetupSharedCommand(program: Command) {
  program
    .command("setup-shared")
    .description(
      "Setup or update the shared package with whitelisted dependencies"
    )
    .argument(
      "[monorepoRoot]",
      "Root of the monorepo (defaults to current directory)"
    )
    .action(async (monorepoRoot = process.cwd()) => {
      try {
        console.log(`Setting up shared package in: ${monorepoRoot}`);
        const config = ConfigManager.loadConfig(monorepoRoot);
        if (!Array.isArray(config.shared?.whitelist)) {
          throw new Error('Config file must have a "shared.whitelist" array');
        }
        await SharedDependencyService.setupSharedPackage(monorepoRoot);
        // Run npm install in the shared directory
        const sharedDir = path.join(monorepoRoot, config.packagesDir, 'shared');
        const { execSync } = require('child_process');
        execSync('npm install', { cwd: sharedDir, stdio: 'inherit' });
        console.log("Shared package setup complete.");
      } catch (err) {
        console.error("Shared setup failed:", err);
        process.exit(1);
      }
    });
}
