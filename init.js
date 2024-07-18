const fs = require("fs");
const prompts = require('prompts');
const { generateHash } = require("random-hash");
const { URL } = require('url');

const envTemplate = fs.readFileSync(".env.template").toString();

if (fs.existsSync('.initiated')) {
    throw new Error("This project has already been initiated");
}

const stringIsAValidUrl = (s, protocols) => {
    try {
        url = new URL(s);
        return protocols
            ? url.protocol
                ? protocols.map(x => `${x.toLowerCase()}:`).includes(url.protocol)
                : false
            : true;
    } catch (err) {
        return false;
    }
};


(async () => {
    const apiUrl = new URL((await prompts({
        type: "text",
        name: "value",
        message: "Enter the API URL",
        initial: "http://127.0.0.1:8055",
        validate: (v) => stringIsAValidUrl(v, ["http", "https"]) ? true : "Invalid URL"
    })).value);
    const randomHash = generateHash({ length: 20 });
    const env = Object.entries({
        NEXT_PUBLIC_API_URL: apiUrl.href,
        API_PING_PATH: "server/ping",
        API_ADMIN_TOKEN: randomHash
    }).reduce((acc, [k, v]) => acc.replace(`\${:${k}}`, v), envTemplate);

    fs.writeFileSync('.env', env);
    fs.writeFileSync(".initiated", "");
    console.log("Generating .env file");
})();
