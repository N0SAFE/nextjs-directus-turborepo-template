const MillionLint = require('@million/lint')

const url = new URL(process.env.NEXT_PUBLIC_API_URL)

const noCheck = process.env.NO_CHECK === 'true'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: noCheck,
    },
    typescript: {
        ignoreBuildErrors: noCheck,
    },
    reactStrictMode: true,
    transpilePackages: ['@repo/ui'],
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                hostname: url.hostname,
                port: url.port,
                protocol: url.protocol.replace(':', ''),
            },
        ],
    },
    experimental: {
        staleTimes: {
            dynamic: 30,
            static: 180,
        },
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
