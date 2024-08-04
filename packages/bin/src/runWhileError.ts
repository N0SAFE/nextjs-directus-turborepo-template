#!/usr/bin/env node

import { Command } from "commander";
import { spawn } from "child_process";

const program = new Command();

program.name("run-white-error").description("CLI to run a task and restart the process while an error occure").version("0.0.0");

program.argument("<run>", "cli task to run");
program.parse(process.argv);

const runChildProcess = () => {
    const childProcessRun = spawn(program.args[0], {
        shell: true,
        stdio: "inherit"
    });
    const restart = () => {
        console.error("\n\x1b[31mAn error occured, restarting the process\x1b[0m\n");
        childProcessRun.kill();
        runChildProcess();
    };
    childProcessRun.on("exit", (code) => {
        if (code !== 0) {
            restart();
        }
    })
};

runChildProcess();