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

let exp

if (process.env.NODE_ENV === 'development') {
    const millionLintConfig = {
        rsc: true,
        dev: 'debug',
    }
    exp = MillionLint.next(millionLintConfig)(nextConfig)
} else {
    exp = nextConfig
}

module.exports = exp
