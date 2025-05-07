import { Command } from "commander";
import { ImportAliasService } from '../services/package/ImportAlias.service';
import * as path from "path";

export function registerUpdateAliasesCommand(program: Command) {
  program
    .command("update-aliases")
    .description(
      "Update TypeScript import aliases and imports to @repo/package"
    )
    .argument("<packagePath>", "Path to the package")
    .argument("<repoName>", "Repository name (for @repo/package)")
    .action(async (packagePath, repoName) => {
      try {
        await ImportAliasService.updateAliases(packagePath, repoName);
        console.log(
          `Updated import aliases in ${packagePath} to @${repoName}/${path.basename(packagePath)}`
        );
      } catch (err) {
        console.error("Alias update failed:", err);
        process.exit(1);
      }
    });
}
