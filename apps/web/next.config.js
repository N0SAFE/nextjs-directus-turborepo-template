const MillionLint = require('@million/lint')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@repo/ui'],
    images: {
        dangerouslyAllowSVG: true,
        domains: [new URL(process.env.NEXT_PUBLIC_API_URL).hostname],
    },
}

const millionLintConfig = {
    rsc: true,
    dev: process.env.NODE_ENV === 'development' ? 'debug' : false,
}

module.exports = MillionLint.next(millionLintConfig)(nextConfig)
