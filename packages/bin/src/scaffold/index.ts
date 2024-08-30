#!/usr/bin/env node

import { Command } from "commander";
import prompts from "prompts";
import * as fs from "fs";

const autoFunc = (func: () => unknown) => {
    return func();
};

const getModules = async (program: Command) => {
    const listOfProgram = fs.readdirSync(__dirname + "/program");

    return await Promise.all(
        listOfProgram.map(async (moduleName) => {
            const module = await require(`${__dirname}/program/${moduleName}`);
            const subCommand = program.command(moduleName);
            if (module?.defineCommand) {
                module?.defineCommand(subCommand);
            }
            return {
                moduleName,
                module,
                subCommand
            };
        })
    );
};

autoFunc(async () => {
    const program = new Command();

    program.name("scaffold").description("Scaffold generator").version("0.0.1");

    program
        .command("init")
        .description("Initialize scaffold")

    const modules = await getModules(program);

    modules.forEach(({ subCommand, moduleName }) => {
        subCommand.action(() => {
            console.log("running", moduleName);
            const modulePack = modules.find(({ moduleName: name }) => name === moduleName);
            if (!modulePack) {
                throw new Error("Invalid module name");
            }
            const { default: run } = modulePack.module;
            run(subCommand);
        });
    });

    program.action(async () => {
        const name = (
            await prompts({
                type: "select",
                name: "value",
                message: "Select the type of scaffold to run",
                choices: modules.map(({ moduleName }) => ({ title: moduleName, value: moduleName }))
            })
        ).value;
        const modulePack = modules.find(({ moduleName }) => moduleName === name);
        if (!modulePack || !modules.some(({ moduleName }) => moduleName === modulePack.moduleName)) {
            throw new Error("Invalid module name");
        }

        const { default: run } = modulePack.module;
        run(modulePack.subCommand);
        return;
    });

    program.parse(process.argv);
});
