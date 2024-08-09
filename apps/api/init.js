const fs = require("fs");
const prompts = require("prompts");

const envTemplate = fs.readFileSync(".env.template").toString();

// read all value between ${: } in the template

const promptConfig = [
    {
        name: "DATABASE-DB_CLIENT",
        type: "select",
        message: "Enter the API URL",
        choices: [
            { title: "PostgreSQL / Redshift", value: "pg" },
            { title: "CockroachDB (Beta)", value: "cockroachdb" },
            { title: "MySQL / MariaDB / Aurora", value: "mysql" },
            { title: "SQLite", value: "sqlite" },
            { title: "Microsoft SQL Server", value: "mssql" },
            { title: "Oracle Database", value: "oracledb" },
        ]
    },
    {
        name: "DATABASE-DB_HOST",
        type: (prev, all) => (!["oracledb", "sqlite"].includes(all["DATABASE-DB_CLIENT"]) ? "text" : null),
        message: "Enter the database host",
        initial: "localhost"
    },
    {
        name: "DATABASE-DB_PORT",
        type: (prev, all) => (!["oracledb", "sqlite"].includes(all["DATABASE-DB_CLIENT"]) ? "number" : null),
        message: "Enter the database port",
        initial: (prev, all) => {
            switch (all["DATABASE-DB_CLIENT"]) {
                case "pg":
                    return 5432;
                case "mysql":
                    return 3306;
                case "mssql":
                    return 1433;
                case "cockroachdb":
                    return 26257;
                default:
                    return 0;
            }
        }
    },
    {
        name: "DATABASE-DB_CONNECT_STRING",
        type: (prev, all) => (["oracledb"].includes(all["DATABASE-DB_CLIENT"]) ? "text" : null),
        message: "Enter the database connect string",
        initial: "localhost:1521/XE"
    },
    {
        name: "DATABASE-DB_DATABASE",
        type: (prev, all) => (!["oracledb", "sqlite"].includes(all["DATABASE-DB_CLIENT"]) ? "text" : null),
        message: "Enter the database name",
        initial: "directus"
    },
    {
        name: "DATABASE-DB_USER",
        type: (prev, all) => (!["sqlite"].includes(all["DATABASE-DB_CLIENT"]) ? "text" : null),
        message: "Enter the database user name",
        initial: "root"
    },
    {
        name: "DATABASE-DB_PASSWORD",
        type: (prev, all) => (!["sqlite"].includes(all["DATABASE-DB_CLIENT"]) ? "text" : null),
        message: "Enter the database user password",
        initial: "secret"
    },
    {
        name: "DATABASE-DB_FILENAME",
        type: (prev, all) => (["sqlite"].includes(all["DATABASE-DB_CLIENT"]) ? "text" : null),
        message: "Enter the database filename",
        initial: "./data.db"
    },
    {   
        name: "ADMIN-ADMIN_EMAIL",
        type: "text",
        message: "Enter the admin email",
        initial: "admin@admin.com"
    },
    {
        name: "ADMIN-ADMIN_PASSWORD",
        type: "text",
        message: "Enter the admin password",
        initial: "adminadmin"
    }
];

(async () => {
    const envValue = await prompts(promptConfig);

    const unusedKeys = promptConfig.filter(({ name }) => !Object.keys(envValue).includes(name)).map(({ name }) => name);

    let env = envTemplate;

    Object.entries(envValue).forEach(([key, value]) => {
        env = env.replace(`\${:${key}}`, value);
    });

    Object.entries({ NEXT_PUBLIC_API_URL: "GENERAL-PUBLIC_URL" }).forEach(([envKey, envTemplateName]) => {
        env = env.replace(`\${:${envTemplateName}}`, process.env[envKey]);
    });

    unusedKeys.forEach((key) => {
        env = env.replace(`${key.split("-").at(-1)}=\${:${key}}`, `# ${key.split("-").at(-1)}=\${:${key}}`);
    });

    fs.writeFileSync(".env", env);
})();
