'use client'

import {
    ThemeProvider as StaticNextThemesProvider,
    ThemeProviderProps,
} from 'next-themes'

import dynamic from 'next/dynamic'

const NextThemesProvider =
    process.env.NODE_ENV === 'production'
        ? StaticNextThemesProvider
        : dynamic(() => import('next-themes').then((e) => e.ThemeProvider), {
              ssr: false,
          })

export default function ThemeProvider({
    children,
    ...props
}: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
