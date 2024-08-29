import { locations } from "./CONSANT";
import { spawnSync } from "child_process";
import path from "path";
import prompt from "prompts";
import * as fs from "fs";
import Utils from "@/scaffold/utils";
const { parse, stringify } = require("envfile");

const utilsInstance = new Utils({
    logging: true
});

export default async function run() {
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
            "nextjs-toploader",
            "zod",
            "@tanstack/react-query",
            "@tanstack/react-query-devtools",
            "prompts"
        ] as ({ name: string; version: string } | string)[]
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

    const deffered: (() => void)[] = [];

    function testIfValidURL(str: string) {
        const pattern = new RegExp(
            "^https?:\\/\\/" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$",
            "i"
        ); // fragment locator

        return !!pattern.test(str);
    }

    const projectDir = await prompt({
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
    }).then((res) => res.dir as string);
    const appUrl = await prompt({
        type: "text",
        name: "url",
        message: "Enter the app url",
        validate: (value) => {
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
        }
    }).then((res) => res.url as string);

    console.log(`\n\nCreating a new Next.js app with npx create-next-app@latest ${projectDir} --typescript --eslint --tailwind --src-dir --app\n\n`);
    spawnSync(`npx create-next-app@latest ${projectDir} --typescript --eslint --tailwind --src-dir --app`, { cwd: locations.apps, stdio: "inherit", shell: true });

    const appLocation = path.resolve(locations.apps, projectDir);
    const packageJSON = JSON.parse(fs.readFileSync(path.resolve(appLocation, "package.json"), "utf-8"));
    
    const envName = `NEXT_PUBLIC_${projectDir.toUpperCase()}_URL`;

    envTemplateFile[envName] = `\${:${envName}}`;
    envFile[envName] = appUrl;

    fs.writeFileSync(path.resolve(locations.root, ".env"), stringify(envFile));
    fs.writeFileSync(path.resolve(locations.root, ".env.template"), stringify(envTemplateFile));

    packageJSON.scripts = JSON.parse(fs.readFileSync(path.resolve(locations.templates, "package.script.json"), "utf-8"));

    utilsInstance.copyFiles(
        [path.resolve(locations.templates, "tailwind.config.ts.njk"), path.resolve(appLocation, "tailwind.config.ts"), { context: {} }],
        [path.resolve(locations.templates, "globals.css.njk"), path.resolve(appLocation, "src/app/globals.css"), { context: {} }],
        [path.resolve(locations.templates, "app/page.tsx.njk"), path.resolve(appLocation, "src/app/page.tsx")],
        [path.resolve(locations.templates, "env.ts.njk"), path.resolve(appLocation, "env.ts")],
        [path.resolve(locations.templates, "env.template.njk"), path.resolve(appLocation, ".env.template")],
        [path.resolve(locations.templates, "init.js.njk"), path.resolve(appLocation, "init.js"), { context: { appUrl, envName: envName } }],
        [path.resolve(locations.templates, "utils/providers/ReactQueryProviders.tsx.njk"), path.resolve(appLocation, "src/utils/providers/ReactQueryProviders.tsx")],
        [path.resolve(locations.templates, "utils/providers/NextAuthProviders/index.tsx.njk"), path.resolve(appLocation, "src/utils/providers/NextAuthProviders/index.tsx")],
        [
            path.resolve(locations.templates, "utils/providers/NextAuthProviders/ClientNextAuthProviders.tsx.njk"),
            path.resolve(appLocation, "src/utils/providers/NextAuthProviders/ClientNextAuthProviders.tsx"),
            { context: {} }
        ],
        [path.resolve(locations.templates, "actions/redirect.ts.njk"), path.resolve(appLocation, "src/actions/redirect.ts")],
        [path.resolve(locations.templates, "types/next-auth.d.ts.njk"), path.resolve(appLocation, "src/types/next-auth.d.ts")]
    );

    // copyFile(path.resolve(appLocation, "tailwind.config.ts"), path.resolve(locations.templates, "tailwind.config.ts.njk"), { context: {} });
    // copyFile(path.resolve(appLocation, "src/app/globals.css"), path.resolve(locations.templates, "globals.css.njk"), { context: {} });
    // copyFile(path.resolve(appLocation, "src/utils/providers/ReactQueryProviders.tsx"), path.resolve(locations.templates, "utils/providers/ReactQueryProviders.tsx.njk"));
    // copyFile(path.resolve(appLocation, "src/utils/providers/NextAuthProviders/index.tsx"), path.resolve(locations.templates, "utils/providers/NextAuthProviders/index.tsx.njk"));
    // copyFile(
    //     path.resolve(appLocation, "src/utils/providers/NextAuthProviders/ClientNextAuthProviders.tsx"),
    //     path.resolve(locations.templates, "utils/providers/NextAuthProviders/ClientNextAuthProviders.tsx.njk"),
    //     { context: {} }
    // );
    // copyFile(path.resolve(appLocation, "src/app/page.tsx"), path.resolve(locations.templates, "app/page.tsx.njk"));
    // copyFile(path.resolve(appLocation, "env.ts"), path.resolve(locations.templates, "env.ts.njk"));
    // copyFile(path.resolve(appLocation, ".env.template"), path.resolve(locations.templates, "env.template.njk"));
    // copyFile(path.resolve(appLocation, "init.js"), path.resolve(locations.templates, "init.js.njk"), { context: { appUrl } });
    // copyFile(path.resolve(appLocation, "src/actions/redirect.ts"), path.resolve(locations.templates, "actions/redirect.ts.njk"));
    // copyFile(path.resolve(appLocation, "src/types/next-auth.d.ts"), path.resolve(locations.templates, "types/next-auth.d.ts.njk"));

    // fs.writeFileSync(path.resolve(appLocation, "tailwind.config.ts"), nunjucks.renderString(fs.readFileSync(path.resolve(locations.templates, "tailwind.config.ts.njk"), "utf-8"), {}));
    // fs.writeFileSync(path.resolve(appLocation, "src/app", "globals.css"), nunjucks.renderString(fs.readFileSync(path.resolve(locations.templates, "globals.css.njk"), "utf-8"), {}));
    // if (!fs.existsSync(path.resolve(appLocation, "src/utils/providers/NextAuthProviders"))) {
    //     fs.mkdirSync(path.resolve(appLocation, "src/utils/providers/NextAuthProviders"), { recursive: true });
    // }
    // fs.writeFileSync(
    //     path.resolve(appLocation, "src/utils/providers", "ReactQueryProviders.tsx"),
    //     fs.readFileSync(path.resolve(locations.templates, "utils/providers/ReactQueryProviders.tsx.njk"), "utf-8")
    // );
    // fs.writeFileSync(
    //     path.resolve(appLocation, "src/utils/providers/NextAuthProviders", "index.tsx"),
    //     fs.readFileSync(path.resolve(locations.templates, "utils/providers/NextAuthProviders/index.tsx.njk"), "utf-8")
    // );
    // fs.writeFileSync(
    //     path.resolve(appLocation, "src/utils/providers/NextAuthProviders", "ClientNextAuthProviders.tsx"),
    //     fs.readFileSync(path.resolve(locations.templates, "utils/providers/NextAuthProviders/ClientNextAuthProviders.tsx.njk"), "utf-8")
    // );
    // fs.writeFileSync(path.resolve(appLocation, "src/app", "page.tsx"), fs.readFileSync(path.resolve(locations.templates, "app/page.tsx.njk"), "utf-8"));
    // fs.writeFileSync(path.resolve(appLocation, "env.ts"), fs.readFileSync(path.resolve(locations.templates, "env.ts.njk"), "utf-8"));
    // fs.writeFileSync(path.resolve(appLocation, ".env.template"), fs.readFileSync(path.resolve(locations.templates, "env.template.njk"), "utf-8"));
    // // fs.writeFileSync(path.resolve(appLocation, "init.js"), nunjucks.renderString(fs.readFileSync(path.resolve(locations.templates, "init.js.njk"), "utf-8"), { appUrl }));
    // if (!fs.existsSync(path.resolve(appLocation, "src/actions"))) {
    //     fs.mkdirSync(path.resolve(appLocation, "src/actions"), { recursive: true });
    // }
    // fs.writeFileSync(path.resolve(appLocation, "src/actions", "redirect.ts"), fs.readFileSync(path.resolve(locations.templates, "actions/redirect.ts.njk"), "utf-8"));
    // if (!fs.existsSync(path.resolve(appLocation, "src/types"))) {
    //     fs.mkdirSync(path.resolve(appLocation, "src/types"), { recursive: true });
    // }
    // fs.writeFileSync(path.resolve(appLocation, "src/types", "next-auth.d.ts"), fs.readFileSync(path.resolve(locations.templates, "types/next-auth.d.ts.njk"), "utf-8"));
    const tsConfig = JSON.parse(fs.readFileSync(path.resolve(appLocation, "tsconfig.json"), "utf-8"));
    tsConfig.compilerOptions.paths["#/*"] = ["./*"];
    fs.writeFileSync(path.resolve(appLocation, "tsconfig.json"), JSON.stringify(tsConfig, null, 4));

    const answer = await prompt({
        type: "multiselect",
        name: "features",
        message: "Select the features you want to add",
        choices: [
            { title: "Directus", value: "directus", description: "install the directus sdk with all the other side package then create the library" },
            { title: "shadcnui", value: "shadcnui", description: "install the shadcnui" },
            { title: "next-auth", value: "next-auth", description: "install next-auth" },
            { title: "auth-page", value: "auth-page", description: "create the page for the login and me route (use next-auth if installed)" },
            { title: "declarative-routing", value: "declarative-routing", description: "Declarative routing is a way to define routes in a single file and use it in the app" }
        ]
    });

    if (answer.features.includes("directus")) {
        deffered.push(() => {
            console.log("install the directus features");

            packageListToInstall.dependencies.push({ name: "@repo/directus-sdk", version: "*" });

            utilsInstance.copyDir(path.resolve(locations.templates, "directus/lib"), path.resolve(appLocation, "src/lib/directus"), {
                fileNameTransform: (file) => {
                    return file.replace(".njk", "");
                },
                context: { useNextAuth: answer.features.includes("next-auth") }
            });

            // if (!fs.existsSync(path.resolve(appLocation, "src/lib/directus"))) {
            //     fs.mkdirSync(path.resolve(appLocation, "src/lib/directus"), { recursive: true });
            // }
            // fs.readdirSync(path.resolve(locations.templates, "directus/lib")).forEach((file) => {
            //     const template = fs.readFileSync(path.resolve(locations.templates, "directus/lib", file), "utf-8");
            //     const rendered = nunjucks.renderString(template, { useNextAuth: answer.features.includes("next-auth") });
            //     fs.writeFileSync(path.resolve(appLocation, "src/lib/directus", file.replace(".njk", "")), rendered);
            // });
        });
    }

    if (answer.features.includes("shadcnui")) {
        deffered.push(() => {
            console.log("install the shadcnui features");

            spawnSync(`npx shadcn-ui@latest init`, { cwd: appLocation, stdio: "inherit", shell: true });
        });
    }

    if (answer.features.includes("next-auth")) {
        deffered.push(() => {
            console.log("install the next-auth features");

            packageListToInstall.dependencies.push("next-auth");
            utilsInstance.copyFiles(
                [path.resolve(locations.templates, "next-auth/app/api/auth/[...nextauth]/route.ts.njk"), path.resolve(appLocation, "src/app/api/auth/[...nextauth]/route.ts")],
                [path.resolve(locations.templates, "next-auth/app/layout.tsx.njk"), path.resolve(appLocation, "src/app/layout.tsx")],
                [path.resolve(locations.templates, "next-auth/env.ts.njk"), path.resolve(appLocation, "src/env.ts")],
                [path.resolve(locations.templates, "next-auth/app/auth/error/page.tsx.njk"), path.resolve(appLocation, "src/app/auth/error/page.tsx")]
            );
            // copyFile(path.resolve(appLocation, "src/api/auth/[...nextauth].ts"), path.resolve(locations.templates, "next-auth/api/auth/[...nextauth].ts.njk"));
            // copyFile(path.resolve(appLocation, "src/app/layout.tsx"), path.resolve(locations.templates, "next-auth/app/layout.tsx.njk"));
            // copyFile(path.resolve(appLocation, "src/ent.ts"), path.resolve(locations.templates, "next-auth/ent.ts.njk"));
            utilsInstance.copyDir(path.resolve(locations.templates, "next-auth/lib/auth"), path.resolve(appLocation, "src/lib/auth"), {
                fileNameTransform: (file) => {
                    return file.replace(".njk", "");
                },
                context: {
                    useDirectus: answer.features.includes("directus"),
                    useDeclarativeRouting: answer.features.includes("declarative-routing")
                }
            });

            // if (!fs.existsSync(path.resolve(appLocation, "src/app/api/auth/[...nextauth]"))) {
            //     fs.mkdirSync(path.resolve(appLocation, "src/app/api/auth/[...nextauth]"), { recursive: true });
            // }
            // fs.writeFileSync(
            //     path.resolve(appLocation, "src/app/api/auth/[...nextauth]", "route.ts"),
            //     fs.readFileSync(path.resolve(locations.templates, "next-auth/app/api/auth/[...nextauth]/route.ts.njk"), "utf-8")
            // );
            // fs.writeFileSync(path.resolve(appLocation, "src/app", "layout.tsx"), fs.readFileSync(path.resolve(locations.templates, "next-auth/app/layout.tsx.njk"), "utf-8"));
            // fs.writeFileSync(path.resolve(appLocation, "src", "env.ts"), fs.readFileSync(path.resolve(locations.templates, "next-auth/env.ts.njk"), "utf-8"));
            // if (!fs.existsSync(path.resolve(appLocation, "src/lib/auth"))) {
            //     fs.mkdirSync(path.resolve(appLocation, "src/lib/auth"), { recursive: true });
            // }
            // fs.readdirSync(path.resolve(locations.templates, "next-auth/lib/auth")).forEach((file) => {
            //     const template = fs.readFileSync(path.resolve(locations.templates, "next-auth/lib/auth", file), "utf-8");
            //     const rendered = nunjucks.renderString(template, {
            //         useDirectus: answer.features.includes("directus"),
            //         useDeclarativeRouting: answer.features.includes("declarative-routing")
            //     });
            //     fs.writeFileSync(path.resolve(appLocation, "src/lib/auth", file.replace(".njk", "")), rendered);
            // });
            if (answer.features.includes("directus")) {
                utilsInstance.copyFiles(
                    [path.resolve(locations.templates, "next-auth/lib/better-unstable-cache.ts.njk"), path.resolve(appLocation, "src/lib/better-unstable-cache.ts")],
                    [path.resolve(locations.templates, "next-auth/lib/utils.ts.njk"), path.resolve(appLocation, "src/lib/utils.ts"), { context: { useShadcnUI: answer.features.includes("shadcnui") } }]
                );
                // copyFile(path.resolve(appLocation, "src/lib/better-unstable-cache.ts"), path.resolve(locations.templates, "next-auth/lib/better-unstable-cache.ts.njk"));
                // copyFile(path.resolve(appLocation, "src/lib/utils.ts"), path.resolve(locations.templates, "next-auth/lib/utils.ts.njk"), {
                //     context: { useShadcnUI: answer.features.includes("shadcnui") }
                // });
                // fs.writeFileSync(
                //     path.resolve(appLocation, "src/lib/better-unstable-cache.ts"),
                //     fs.readFileSync(path.resolve(locations.templates, "next-auth/lib/better-unstable-cache.ts.njk"), "utf-8")
                // );
                // fs.writeFileSync(
                //     path.resolve(appLocation, "src/lib/utils.ts"),
                //     nunjucks.renderString(fs.readFileSync(path.resolve(locations.templates, "next-auth/lib/utils.ts.njk"), "utf-8"), {
                //         useShadcnUI: answer.features.includes("shadcnui")
                //     })
                // );
            }
        });
    }

    if (answer.features.includes("auth-page")) {
        deffered.push(() => {
            console.log("install the auth-page features");

            utilsInstance.copyFiles(
                [path.resolve(locations.templates, "auth-page/app/auth/login/page.tsx.njk"), path.resolve(appLocation, "src/app/auth/login/page.tsx")],
                [path.resolve(locations.templates, "auth-page/app/auth/me/page.tsx.njk"), path.resolve(appLocation, "src/app/auth/me/page.tsx")],
                [path.resolve(locations.templates, "auth-page/app/auth/me/SignOutButton.tsx.njk"), path.resolve(appLocation, "src/app/auth/me/SignOutButton.tsx")]
            );

            // copyFile(path.resolve(appLocation, "src/app/auth/login/page.tsx"), path.resolve(locations.templates, "auth-page/app/auth/login/page.tsx.njk"));
            // copyFile(path.resolve(appLocation, "src/app/auth/me/page.tsx"), path.resolve(locations.templates, "auth-page/app/auth/me/page.tsx.njk"));
            // copyFile(path.resolve(appLocation, "src/app/auth/me/SignOutButton.tsx"), path.resolve(locations.templates, "auth-page/app/auth/me/SignOutButton.tsx.njk"));

            // if (!fs.existsSync(path.resolve(appLocation, "src/app/auth/login"))) {
            //     fs.mkdirSync(path.resolve(appLocation, "src/app/auth/login"), { recursive: true });
            // }
            // if (!fs.existsSync(path.resolve(appLocation, "src/app/auth/me"))) {
            //     fs.mkdirSync(path.resolve(appLocation, "src/app/auth/me"), { recursive: true });
            // }
            // fs.writeFileSync(path.resolve(appLocation, "src/app/auth/login", "page.tsx"), fs.readFileSync(path.resolve(locations.templates, "auth-page/app/auth/login/page.tsx.njk"), "utf-8"));
            // fs.writeFileSync(path.resolve(appLocation, "src/app/auth/me", "page.tsx"), fs.readFileSync(path.resolve(locations.templates, "auth-page/app/auth/me/page.tsx.njk"), "utf-8"));
            // fs.writeFileSync(
            //     path.resolve(appLocation, "src/app/auth/me", "SignOutButton.tsx"),
            //     fs.readFileSync(path.resolve(locations.templates, "auth-page/app/auth/me/SignOutButton.tsx.njk"), "utf-8")
            // );
        });
    }

    if (answer.features.includes("declarative-routing")) {
        deffered.push(() => {
            console.log("install the declarative-routing features");

            spawnSync("npx declarative-routing init", { cwd: appLocation, stdio: "inherit", shell: true });
            spawnSync("npx declarative-routing build", { cwd: appLocation, stdio: "inherit", shell: true });
        });
    }

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
    
    spawnSync("npm run init", { cwd: appLocation, stdio: "inherit", shell: true });
}
