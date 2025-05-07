#!/usr/bin/env node
import { Command } from "commander";
import { registerRenameCommand } from "./rename";
import { registerUpdateAliasesCommand } from "./update-aliases";
import { registerSetupSharedCommand } from "./setup-shared";
import { registerInitConfigCommand } from "./init-config";

export function main() {
  const program = new Command();

  registerRenameCommand(program);
  registerUpdateAliasesCommand(program);
  registerSetupSharedCommand(program);
  registerInitConfigCommand(program);

  program.parseAsync(process.argv);
}
