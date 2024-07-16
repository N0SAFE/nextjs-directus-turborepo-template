const fs = require("fs");
const { type } = require("os");
const prompts = require('prompts');
const { URL } = require('url');

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
    const email = (await prompts({
        type: "text",
        name: "value",
        message: "Enter the admin email",
        initial: "admin@admin.com"
    })).value;
    const password = (await prompts({
        type: "text",
        name: "value",
        message: "Enter the admin password",
        initial: "adminadmin"
    })).value;
    fs.writeFileSync('.env', Object.entries({
        NEXT_PUBLIC_API_URL: apiUrl.href,
        API_PING_PATH: "server/ping",
        DEFAULT_ADMIN_EMAIL: email,
        DEFAULT_ADMIN_PASSWORD: password,
    }).map(([k, v]) => `${k}=${v}`).join("\n") + "\n");
    console.log("Generating .env file");
})();
