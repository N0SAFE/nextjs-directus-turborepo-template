import { Monitoring } from 'react-scan/monitoring/next'
import '@repo/ui/styles/globals.css' // ! load the local stylesheets first to allow for overrides of the ui package components
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@repo/ui/lib/utils'
import ThemeProvider from '@repo/ui/components/theme-provider'
import Loader from '@repo/ui/components/atomics/atoms/Loader'
import ReactQueryProviders from '@/utils/providers/ReactQueryProviders'
import { Suspense, type JSX } from 'react'
import NextAuthProviders from '@/utils/providers/NextAuthProviders/index'
import NextTopLoader from 'nextjs-toploader'
import Validate from '@/lib/auth/validate'
import Script from 'next/script'
import { validateEnv } from '#/env'

const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
    title: 'Create Turborepo',
    description: 'Generated by create turbo',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}): Promise<JSX.Element> {
    const env = validateEnv(process.env)

    return (
        <html lang="en">
            <head>
                {env.REACT_SCAN && (
                    <Script
                        src="https://unpkg.com/react-scan/dist/auto.global.js"
                        strategy="beforeInteractive"
                        async
                    />
                )}
            </head>
            <body
                className={cn(
                    fontSans.variable,
                    'h-screen w-screen overflow-auto bg-background font-sans antialiased'
                )}
            >
                {env.REACT_SCAN && env.REACT_SCAN_TOKEN && (
                    <Monitoring
                        apiKey={env.REACT_SCAN_TOKEN} // Safe to expose publically
                        url="https://monitoring.react-scan.com/api/v1/ingest"
                        commit={env.REACT_SCAN_GIT_COMMIT_HASH} // optional but recommended
                        branch={env.REACT_SCAN_GIT_BRANCH} // optional but recommended
                    />
                )}
                <NextAuthProviders>
                    <Validate>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <NextTopLoader />
                            <ReactQueryProviders>
                                <Suspense
                                    fallback={
                                        <div className="flex h-screen w-screen items-center justify-center">
                                            <Loader />
                                        </div>
                                    }
                                >
                                    {children}
                                </Suspense>
                            </ReactQueryProviders>
                        </ThemeProvider>
                    </Validate>
                </NextAuthProviders>
            </body>
        </html>
    )
}
