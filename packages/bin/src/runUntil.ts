#!/usr/bin/env node

import { Command } from "commander";
import { spawnSync, spawn, exec } from "child_process";

const program = new Command();

program
  .name("run-until")
  .description("CLI to run a task until another task is run")
  .version("0.0.0");

program
  .argument("<run>", "cli task to run")
  .argument("<until>", "cli task to run until");
program.parse(process.argv);

const childProcessRun = spawn(program.args[0], {
  shell: true,
});
const onExit = () => {
  childProcessRun.kill();
  process.exit(0);
};
childProcessRun.on("exit", onExit);
childProcessRun.stdout.on("data", (data) => {
  console.log(data.toString());
});
spawnSync(program.args[1], {
  stdio: "inherit",
  shell: true,
});
childProcessRun.off("exit", onExit);

setTimeout(() => {
  if (process.platform == "win32") {
    exec(`taskkill /PID ${childProcessRun.pid!} /T /F`, (error) => {
      if (error) {
        console.log("error: " + error.message);
      }
      setTimeout(() => {
        process.exit(0);
      }, 1500);
    });
  } else {
    // see https://nodejs.org/api/child_process.html#child_process_options_detached
    // If pid is less than -1, then sig is sent to every process in the process group whose ID is -pid.
    process.kill(-childProcessRun.pid!, "SIGKILL");
    setTimeout(() => {
      process.exit(0);
    }, 1500);
  }
}, 3000);
