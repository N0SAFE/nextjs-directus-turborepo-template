const generateHash = require("random-hash").generateHash;
const fs = require("fs");
require("dotenv").config();

(async () => {
    const randomHash = generateHash({ length: 20 });

    const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
    const user = await fetch(apiUrl.href + "auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: process.env.DEFAULT_ADMIN_EMAIL,
            password: process.env.DEFAULT_ADMIN_PASSWORD
        })
    }).then((res) => res.json());
    const res = await fetch(apiUrl.href + "users/me", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.data.access_token}`
        },
        body: JSON.stringify({
            token: randomHash
        })
    });
    if (res.ok) {
        fs.writeFileSync(".env", `${["NEXT_PUBLIC_API_URL", "API_PING_PATH"].map((n) => `${n}=${process.env[n]}`).join("\n")}\nAPI_ADMIN_TOKEN=${randomHash}\n`);
        fs.writeFileSync(".initiated", "");
        console.log("Generating .env file with random token:", randomHash);
    }
})();
