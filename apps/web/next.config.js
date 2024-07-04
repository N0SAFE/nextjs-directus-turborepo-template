/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    reactStrictMode: true,
    transpilePackages: ["@repo/ui"],
    images: {
        dangerouslyAllowSVG: true,
        domains: [process.env.NEXT_PUBLIC_API_HOSTNAME]
    }
};
