import { locations } from "./CONSANT";
import { spawnSync } from "child_process";
import path from "path";
import prompt from "prompts";
import * as fs from "fs";
import Utils from "@/scaffold/utils";
import nunjucks from "nunjucks";
import { Command, Option } from "commander";
const { parse, stringify } = require("envfile");

const utilsInstance = new Utils({
    logging: true
});

function testIfValidURL(str: string) {
    const pattern = new RegExp(
        "^https?:\\/\\/" + // protocol
            "(((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|localhost)|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
        "i"
    ); // fragment locator

    return !!pattern.test(str);
}

const getNextPort = (portToTest: string, appUrls: URL[]) => {
    const port = portToTest;
    if (appUrls.some((a) => a.port === port)) {
        return getNextPort(`${Number(port) + 1}`, appUrls);
    }
    return port;
};

export function defineCommand(subCommand: Command) {
    subCommand
        .name("next-app")
        .description("Create a new next.js app with some features")
        .addOption(new Option("--name <name>", "The name of the project"))
        .option("--url <url>", "The url of the project")
        .option("-f, --force", "Force the creation of the project");
}

const validateOptionCommand = <T>(program: Command, value: T, validator: (value: T) => string | boolean, force?: boolean) => {
    const res = validator(value);
    if (res === true) {
        return value;
    }
    if (force) {
        console.warn(res || "Invalid value");
        return value;
    }
    return program.error(res || "Invalid value");
};

const validateAppUrl = (value: string) => {
    if (!testIfValidURL(value)) {
        return "Please enter a valid url";
    }
    if (appUrls.includes(value)) {
        return "The url " + value + " is already used";
    }
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return "Please enter a valid url";
    }
    if (appUrls.some((a) => new URL(a).port === url.port)) {
        return "The port is already used";
    }
    return true;
};

const validateAppName = (value: string) => {
    if (value.length === 0) {
        return "Please enter a valid name";
    }
    if (dirIntoApps.some((dirName) => dirName === value)) {
        return "The project name is already used";
    }
    return true;
};

const dirIntoApps = fs.readdirSync(locations.apps);
const envTemplateFile = parse(fs.readFileSync(path.resolve(locations.root, ".env.template"), "utf-8"));
const envFile = parse(fs.readFileSync(path.resolve(locations.root, ".env"), "utf-8"));
const appUrls = Object.entries(envFile as Record<string, string>)
    .filter(([key]) => {
        // regexp to check all NEXT_PUBLIC_${somethings}_URL
        return key.match(/NEXT_PUBLIC_(.*)URL/);
    })
    .map((array) => array[1]);

export default async function run(subCommand: Command) {
    const opts = subCommand.opts();
    console.log(opts)
    const packageListToInstall = {
        devDependencies: [] as ({ name: string; version: string } | string)[],
        dependencies: [
            {
                name: "@repo/ui",
                version: "*"
            },
            {
                name: "@repo/bin",
                version: "*"
            },
            {
                name: "@repo/tailwind-config",
                version: "*"
            },
            {
                name: "@repo/tsconfig",
                version: "*"
            },
            "nextjs-toploader",
            "zod",
            "@tanstack/react-query",
            "@tanstack/react-query-devtools",
            "prompts"
        ] as ({ name: string; version: string } | string)[]
    };
    const deffered: (() => void)[] = [];

    const projectDir = validateOptionCommand(
        subCommand,
        opts.name ??
            (await prompt({
                type: "text",
                name: "dir",
                message: "Enter the project name",
                validate: (value) => {
                    if (value.length === 0) {
                        return "Please enter a valid name";
                    }
                    if (dirIntoApps.some((dirName) => dirName === value)) {
                        return "The project name is already used";
                    }
                    return true;
                }
            }).then((res) => res.dir as string)),
        validateAppName,
        opts.force
    );
    const appUrl = validateOptionCommand(
        subCommand,
        opts.url ??
            (await prompt({
                type: "text",
                name: "url",
                message: "Enter the app url",
                initial: `http://localhost:${getNextPort(
                    "3000",
                    appUrls.map((a) => new URL(a))
                )}`,
                validate: validateAppUrl
            }).then((res) => res.url as string)),
        validateAppUrl,
        opts.force
    );

    console.log(`\n\nCreating a new Next.js app with npx create-next-app@latest ${projectDir} --skip-install --typescript --no-import-alias  --eslint --tailwind --src-dir --app\n\n`);
    spawnSync(`npx create-next-app@latest ${projectDir} --skip-install --typescript --no-import-alias  --eslint --tailwind --src-dir --app`, { cwd: locations.apps, stdio: "inherit", shell: true });

    const appLocation = path.resolve(locations.apps, projectDir);
    const packageJSON = JSON.parse(fs.readFileSync(path.resolve(appLocation, "package.json"), "utf-8"));
    const mainPackageJSON = JSON.parse(fs.readFileSync(path.resolve(locations.root, "package.json"), "utf-8"));

    const envName = `NEXT_PUBLIC_${projectDir.toUpperCase()}_URL`;
    const envPortName = `NEXT_PUBLIC_${projectDir.toUpperCase()}_PORT`;

    envTemplateFile[envName] = `\${:${envName}}`;
    envFile[envName] = appUrl;
    envFile[envPortName] = new URL(appUrl).port;
    const rec = (value: string) => {
        if (mainPackageJSON.scripts[value]) {
            return rec(value + "_");
        }
        return value;
    };
    mainPackageJSON.scripts[rec(projectDir)] = `dotenv -e .env -- npm run --workspace=${projectDir} --`;

    fs.writeFileSync(path.resolve(locations.root, ".env"), stringify(envFile));
    fs.writeFileSync(path.resolve(locations.root, ".env.template"), stringify(envTemplateFile));
    fs.writeFileSync(path.resolve(locations.root, "package.json"), JSON.stringify(mainPackageJSON, null, 4));

    packageJSON.scripts = JSON.parse(nunjucks.renderString(fs.readFileSync(path.resolve(locations.templates, "main", "package.script.json.njk"), "utf-8"), { envPortName }));

    utilsInstance.copyDir(path.resolve(locations.templates, "main"), appLocation, {
        context: { appUrl, envName, envPortName },
        fileNameTransform: (file) => {
            if (file === "env.template.njk") {
                return ".env.template";
            }
            return file.replace(".njk", "");
        }
    });

    const tsConfig = JSON.parse(fs.readFileSync(path.resolve(appLocation, "tsconfig.json"), "utf-8"));
    tsConfig.compilerOptions.paths["#/*"] = ["./*"];
    fs.writeFileSync(path.resolve(appLocation, "tsconfig.json"), JSON.stringify(tsConfig, null, 4));

    const answer = await prompt({
        type: "multiselect",
        name: "features",
        message: "Select the features you want to add",
        choices: [
            { title: "Directus", value: "directus", description: "install the directus sdk with all the other side package then create the library" },
            { title: "next-auth", value: "next-auth", description: "install next-auth" },
            { title: "auth-page", value: "auth-page", description: "create the page for the login and me route (use next-auth if installed)" },
            { title: "declarative-routing", value: "declarative-routing", description: "Declarative routing is a way to define routes in a single file and use it in the app" }
        ]
    });

    if (answer.features.includes("directus")) {
        deffered.push(() => {
            console.log("install the directus features");

            packageListToInstall.dependencies.push({ name: "@repo/directus-sdk", version: "*" });

            utilsInstance.copyDir(path.resolve(locations.templates, "features", "directus"), path.resolve(appLocation), {
                fileNameTransform: (file) => {
                    return file.replace(".njk", "");
                },
                context: { useNextAuth: answer.features.includes("next-auth") }
            });
        });
    }

    if (answer.features.includes("next-auth")) {
        deffered.push(() => {
            console.log("install the next-auth features");

            packageListToInstall.dependencies.push("next-auth");
            utilsInstance.copyDir(path.resolve(locations.templates, "features", "next-auth"), path.resolve(appLocation), {
                fileNameTransform: (file) => {
                    return file.replace(".njk", "");
                },
                context: {
                    useDirectus: answer.features.includes("directus"),
                    useDeclarativeRouting: answer.features.includes("declarative-routing")
                }
            });
        });
    }

    if (answer.features.includes("auth-page")) {
        deffered.push(() => {
            console.log("install the auth-page features");

            utilsInstance.copyDir(path.resolve(locations.templates, "features", "auth-page"), path.resolve(appLocation), {
                fileNameTransform: (file) => {
                    return file.replace(".njk", "");
                }
            });
        });
    }

    if (answer.features.includes("declarative-routing")) {
        deffered.push(() => {
            console.log("install the declarative-routing features");

            utilsInstance.copyDir(path.resolve(locations.templates, "features", "declarative-routing"), path.resolve(appLocation), {
                fileNameTransform: (file) => {
                    return file.replace(".njk", "");
                }
            });

            spawnSync("npx declarative-routing build", { cwd: appLocation, stdio: "inherit", shell: true });
        });
    }

    utilsInstance.copyFile(path.resolve(locations.templates, "main", "tailwind.config.ts.njk"), path.resolve(appLocation, "tailwind.config.ts"));

    const runDeffered = async () => {
        for (const fn of deffered) {
            await fn();
        }
    };

    const installDependencies = () => {
        const depToInstall: string[] = [];
        const devDepToInstall: string[] = [];
        packageListToInstall.dependencies.forEach((dep) => {
            if (typeof dep === "string") {
                depToInstall.push(dep);
            } else {
                packageJSON.dependencies[dep.name] = dep.version;
            }
        });
        packageListToInstall.devDependencies.forEach((dep) => {
            if (typeof dep === "string") {
                devDepToInstall.push(dep);
            } else {
                packageJSON.devDependencies[dep.name] = dep.version;
            }
        });
        console.log("write the package.json file");
        fs.writeFileSync(path.resolve(appLocation, "package.json"), JSON.stringify(packageJSON, null, 4));
        console.log("install the dependencies");
        spawnSync(`npm install ${depToInstall.join(" ")}`, { cwd: appLocation, stdio: "inherit", shell: true });
        spawnSync(`npm install ${devDepToInstall.join(" ")} --save-dev`, { cwd: appLocation, stdio: "inherit", shell: true });
    };

    await runDeffered();
    installDependencies();

    spawnSync("npm run init", { cwd: appLocation, stdio: "inherit", shell: true, env: { ...process.env, [envName]: appUrl, [envPortName]: new URL(appUrl).port } });
}
