#!/usr/bin/env node

import { Command } from "commander";
import prompts from "prompts";
import * as fs from "fs";

const program = new Command();

program.name("cron").description("CLI to run cron jobs that run cli").version("0.0.0");

program.option("type, t", "type of the scafold to run");

const command = program.parse(process.argv);

const allowedType = fs.readdirSync(__dirname + "/type");
const name = command.args[0];

(async () => {
    if (allowedType.includes(name)) {
        const { default: run } = await import(`${__dirname}/type/${name}`);
        run();
        return;
    }
    const response = await prompts({
        type: "select",
        name: "value",
        message: "Select the type of scaffold to run",
        choices: allowedType.map((t) => ({ title: t, value: t }))
    });
    const t = response.value;
    const { default: run } = await require(`${__dirname}/type/${t}`);
    console.log(`\nrunning the ${t} scaffolder\n\n`)
    run();
    return;
})();
