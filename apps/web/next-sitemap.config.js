/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://example.com',
    generateRobotsTxt: true, // (optional)
    // ...other options
}
