const fs = require("fs");
const { format } = require("path");
const prompts = require("prompts");
const { generateHash } = require("random-hash");
const { URL } = require("url");
const { parse, stringify } = require("envfile");

const envTemplate = fs.readFileSync(".env.template").toString();
const packageJson = JSON.parse(fs.readFileSync("package.json").toString());

if (fs.existsSync(".initiated")) {
    throw new Error("This project has already been initiated");
}

const stringIsAValidUrl = (s, protocols) => {
    try {
        url = new URL(s);
        return protocols ? (url.protocol ? protocols.map((x) => `${x.toLowerCase()}:`).includes(url.protocol) : false) : true;
    } catch (err) {
        return false;
    }
};

const listOfApp = Object.keys(parse(fs.readFileSync(".env.template").toString())).filter((key) => {
    // regexp to check all NEXT_PUBLIC_${somethings}_URL
    return key.match(/NEXT_PUBLIC_(.*)_URL/);
});

(async () => {
    const projectName = await prompts({
        type: "text",
        name: "value",
        message: "Enter the project name",
        initial: packageJson.name
    });
    
    const urls = []
    for (const app of listOfApp) {
        const name = app.match(/NEXT_PUBLIC_(.*)_URL/)[1];
        const url = new URL(
            (
                await prompts({
                    type: "text",
                    name: "value",
                    message: `Enter the ${app} URL`,
                    initial: app === "NEXT_PUBLIC_API_URL" ? "http://127.0.0.1:8055" : app === "NEXT_PUBLIC_APP_URL" ? "http://127.0.0.1:3000" : `http://127.0.0.1:300${index + 1}`,
                    validate: (v) => (stringIsAValidUrl(v, ["http", "https"]) ? true : "Invalid URL")
                })
            ).value
        );
        urls.push({
            name,
            app,
            url: url.href
        })
    }
    // const apiUrl = new URL(
    //     (
    //         await prompts({
    //             type: "text",
    //             name: "value",
    //             message: "Enter the API URL",
    //             initial: "http://127.0.0.1:8055",
    //             validate: (v) => (stringIsAValidUrl(v, ["http", "https"]) ? true : "Invalid URL")
    //         })
    //     ).value
    // );
    // const appUrl = new URL(
    //     (
    //         await prompts({
    //             type: "text",
    //             name: "value",
    //             message: "Enter the APP URL",
    //             initial: "http://127.0.0.1:3000",
    //             validate: (v) => (stringIsAValidUrl(v, ["http", "https"]) ? true : "Invalid URL")
    //         })
    //     ).value
    // );
    const randomHash = generateHash({ length: 20 });
    const env = Object.entries({
        ...urls.reduce((acc, { name, url, app }) => ({ ...acc, [app]: url, [`NEXT_PUBLIC_${name}_PORT`]: new URL(url).port }), {}),
        API_PING_PATH: "server/ping",
        API_ADMIN_TOKEN: randomHash
    }).reduce((acc, [k, v]) => acc.replace(`\${:${k}}`, v), envTemplate);

    fs.writeFileSync(
        "package.json",
        JSON.stringify(
            {
                ...packageJson,
                name: projectName.value
            },
            null,
            4
        )
    );
    fs.writeFileSync(".env", env);
    console.log("Generating .env file");
})();
