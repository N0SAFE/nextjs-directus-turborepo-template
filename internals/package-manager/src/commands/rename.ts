import { Command } from "commander";
import { PackageRenameService } from '../services/package/PackageRename.service';
import * as path from "path";

export function registerRenameCommand(program: Command) {
  program
    .command("rename")
    .description("Rename a package to @repo/package and update references")
    .argument("<packagePath>", "Path to the package")
    .argument("<repoName>", "Repository name (for @repo/package)")
    .action(async (packagePath, repoName) => {
      try {
        await PackageRenameService.renamePackage(packagePath, repoName);
        console.log(
          `Renamed package at ${packagePath} to @${repoName}/${path.basename(packagePath)}`
        );
      } catch (err) {
        console.error("Rename failed:", err);
        process.exit(1);
      }
    });
}
