module.exports = function (env) {
    if (!env.NEXT_PUBLIC_API_URL) {
        throw new Error("The NEXT_PUBLIC_API_URL environment variable is required to start the app");
    }
    
    const apiUrl = new URL(env.NEXT_PUBLIC_API_URL);
    const port = apiUrl.port;
    const host = apiUrl.hostname;

    return {
        ...env,
        HOST: host,
        PORT: port,
        PUBLIC_URL: apiUrl.href,
        ADMIN_EMAIL: env.DEFAULT_ADMIN_EMAIL, // this value is only set when the bootstrap script run from the init.js file
        ADMIN_PASSWORD: env.DEFAULT_ADMIN_PASSWORD, // this value is only set when the bootstrap script run from the init.js file
    };
};
