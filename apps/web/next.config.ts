import MillionLint from '@million/lint'
import withBundleAnalyzer from '@next/bundle-analyzer'
import { NextConfig } from 'next'

// Check if we're running in a lint context or other non-build contexts
const commandLine = process.argv.join(' ')
const isLintContext =
    process.argv.includes('lint') ||
    process.argv.some((arg) => arg.includes('eslint')) ||
    process.env.npm_lifecycle_event === 'lint' ||
    process.env.npm_lifecycle_script?.includes('lint') ||
    process.argv.some((arg) => arg.includes('next-lint')) ||
    commandLine.endsWith('lint')

if (!process.env.API_URL) {
    if (isLintContext) {
        // Provide a default URL for linting context to avoid breaking the lint process
        process.env.API_URL = 'http://localhost:3001'
        console.warn(
            'API_URL not defined, using default for lint context:',
            process.env.API_URL
        )
    } else {
        throw new Error('API_URL is not defined')
    }
}

// Handle both full URLs and hostname-only values (for Render deployment)
let apiUrl: string
try {
    // Try to parse as full URL first
    new URL(process.env.API_URL)
    apiUrl = process.env.API_URL
} catch {
    // If it fails, assume it's a hostname and add https protocol
    apiUrl = `https://${process.env.API_URL}`
}

const url = new URL(apiUrl)

const noCheck = process.env.CHECK_ON_BUILD !== 'true'

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/auth/:path*',
                destination: `${url.origin}/api/auth/:path*`,
            },
            {
                source: '/api/nest/:path*',
                destination: `${url.origin}/:path*`,
            }
        ]
    },
    eslint: {
        ignoreDuringBuilds: noCheck,
    },
    typescript: {
        ignoreBuildErrors: noCheck,
        // compilerOptions: {
        //   experimentalDecorators: true,
        //   useDefineForClassFields: true,
        // },
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
                protocol: url.protocol.replace(':', '') as 'http' | 'https',
            },
        ],
    },
    output: 'standalone',
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
        dev: 'debug' as const,
    }
    exp = MillionLint.next(millionLintConfig)(exp)
}

module.exports = exp
