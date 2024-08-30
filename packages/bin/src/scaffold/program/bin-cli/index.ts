import prompt from "prompts";
import nunjucks from "nunjucks";
import * as fs from "fs";
import path from "path";
import { location } from "./CONSANT";

export default async function run() {
    const response = await prompt([
        {
            type: "text" as const,
            name: "name",
            message: "Enter the cli name",
            validate: (value) => (value.length > 0 ? true : "Please enter a valid name")
        },
        {
            type: "text" as const,
            name: "description",
            message: "What is the description of the CLI?",
            validate: (value) => (value.length > 0 ? true : "Please enter a valid description")
        }
    ]);

    const { name, description } = response;
    console.log(`\n\nCreating a new CLI with the name ${name} and description ${description}\n\n`);

    nunjucks.configure("views", { autoescape: true });
    const template = fs.readFileSync(path.resolve(`${__dirname}/../../template/bin-cli/main-file.ts.njk`), "utf-8");
    const rendered = await nunjucks.renderString(template, response);

    fs.writeFileSync(path.resolve(location, `${name}.ts`), rendered);

    console.log(`\n\nCreated the CLI at ${path.resolve(location, `${name}.ts`)}\n\n`);
    return;
}
