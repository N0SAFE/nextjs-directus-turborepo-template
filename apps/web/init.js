const fs = require("fs");
const prompts = require("prompts");
const { generateHash } = require("random-hash");

const envTemplate = fs.readFileSync(".env.template").toString();

// read all value between ${: } in the template

(async () => {
    const RANDOM_NEXTAUTH_SECRET = generateHash({ length: 20 });
    
    console.log("NextAuth Secret: ", RANDOM_NEXTAUTH_SECRET);
    
    const envValue = {
        NEXTAUTH_SECRET: RANDOM_NEXTAUTH_SECRET,
    }
    
    if (!process.env.TEMP_APP_NEXTAUTH_URL) {
        throw new Error("TEMP_APP_NEXTAUTH_URL is not defined");
    } else {
        envValue.NEXTAUTH_URL = process.env.TEMP_APP_NEXTAUTH_URL;
    }

    let env = envTemplate;

    Object.entries(envValue).forEach(([key, value]) => {
        env = env.replace(`\${:${key}}`, value);
    });
    
    console.log("generating .env");

    fs.writeFileSync(".env", env);
})();
