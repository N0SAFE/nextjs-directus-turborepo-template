const MillionLint = require('@million/lint')
const withBundleAnalyzer = require('@next/bundle-analyzer')

const url = new URL(process.env.NEXT_PUBLIC_API_URL)

const noCheck = process.env.CHECK_ON_BUILD !== 'true'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: noCheck,
    },
    typescript: {
        ignoreBuildErrors: noCheck,
        compilerOptions: {
            experimentalDecorators: true,
            useDefineForClassFields: true,
        },
    },
    reactStrictMode: true,
    transpilePackages: ['@repo/ui'],
    experimental: {
        // ppr: 'incremental',
        reactCompiler: true,
    },
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
}

let exp = nextConfig

if (process.env.ANALYZE === 'true') {
    exp = withBundleAnalyzer()(exp)
}

if (
    process.env.NODE_ENV === 'development' &&
    process.env.MILLION_LINT === 'true'
) {
    const millionLintConfig = {
        rsc: true,
        dev: 'debug',
    }
    exp = MillionLint.next(millionLintConfig)(exp)
}

module.exports = exp
