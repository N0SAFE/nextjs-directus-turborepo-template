/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    generateRobotsTxt: true,
    // Optional: exclude specific routes
    exclude: ['/api/*', '/auth/*'],
    // Optional: add additional paths
    // additionalPaths: async (config) => {
    //   const paths = [
    //     await config.transform(config, '/'),
    //     await config.transform(config, '/showcase'),
    //     await config.transform(config, '/showcase/client'),
    //     await config.transform(config, '/showcase/server'),
    //   ];

    //   // Only add build-info if not during Docker build
    //   if (process.env.SKIP_STATIC_GENERATION !== 'true') {
    //     paths.push(await config.transform(config, '/build-info'));
    //   }

    //   return paths;
    // },
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/auth/'],
            },
        ],
    },
}
