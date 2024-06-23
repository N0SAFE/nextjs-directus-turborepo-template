#!/usr/bin/env node

import { Command } from "commander";
import { schedule } from "node-cron";
import { spawnSync } from "child_process";

const program = new Command();

program
  .name("cron")
  .description("CLI to run cron jobs that run cli")
  .version("0.0.0");

program.argument("<cron>", "cron string to parse").argument("<cli>", "run cli");

program.parse(process.argv);

schedule(
  program.args[0],
  (now) => {
    console.log(now, "Running cron job:", program.args[1]);
    spawnSync(program.args[1], {
      stdio: "inherit",
      shell: true,
    });
  },
  {
    runOnInit: true,
  },
);
