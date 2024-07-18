module.exports = function (env) {
    if (!env.NEXT_PUBLIC_API_URL) {
        console.error("NEXT_PUBLIC_API_URL is not set, rollback to env.PUBLIC_URL : " + env.PUBLIC_URL);
    }
    
    const apiUrl = new URL(env.NEXT_PUBLIC_API_URL || env.PUBLIC_URL);
    const port = apiUrl.port;
    const host = apiUrl.hostname;

    return {
        ...env,
        HOST: host,
        PORT: port,
        PUBLIC_URL: apiUrl.href,
        ADMIN_TOKEN: env.API_ADMIN_TOKEN,
    };
};
