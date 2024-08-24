const MillionLint = require('@million/lint')
const million = require('million/compiler')

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

const millionConfig = {
    auto: {
        rsc: true,
    }, // if you're using RSC: auto: { rsc: true },
    rsc: true,
}

const millionLintConfig = {
    rsc: true,
    dev: process.env.NODE_ENV === 'development' ? 'debug' : false,
}

module.exports = MillionLint.next(millionLintConfig)(
    million.next(nextConfig, millionConfig)
)
