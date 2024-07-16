/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    reactStrictMode: true,
    transpilePackages: ['@repo/ui'],
    images: {
        dangerouslyAllowSVG: true,
        domains: [new URL(process.env.NEXT_PUBLIC_API_URL).hostname],
    },
}
