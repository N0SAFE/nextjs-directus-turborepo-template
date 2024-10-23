#!/usr/bin/env node

import { Command } from "commander";
import { spawnSync, spawn, exec } from "child_process";
import { killPortProcess } from "kill-port-process";

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

function Try(callback: () => void) {
  try{
    callback();
  } catch {}
}

  console.log(process.platform)
  if (process.platform == "win32") {
    exec(`taskkill /PID ${childProcessRun.pid!} /T /F`, (error) => {
      if (error) {
        console.log("error: " + error.message);
      }
        Try(() => process.kill(-process.pid, "SIGKILL"));
        process.exit(0);
    });
  } else {
    console.log("killing process with pid " + childProcessRun.pid);
    // see https://nodejs.org/api/child_process.html#child_process_options_detached
    // If pid is less than -1, then sig is sent to every process in the process group whose ID is -pid.
    Try(() => process.kill(-childProcessRun.pid!, "SIGKILL"));
    Try(() => childProcessRun.kill());
      Try(() => process.kill(-process.pid, "SIGKILL"));
      process.exit(0);
  }
