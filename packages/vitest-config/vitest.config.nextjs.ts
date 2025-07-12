/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createBaseConfig } from './vitest.config.base'
import * as path from 'path'

/**
 * Next.js-specific Vitest configuration for web applications
 */
export const createNextJSConfig = (overrides = {}) => {
  return createBaseConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.react.ts'],
      globals: true,
      // Mock Next.js modules
      server: {
        deps: {
          inline: ['next', '@next/font'],
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), './src'),
        '#': path.resolve(process.cwd(), './'),
        '~': path.resolve(process.cwd(), './'),
        '@repo': path.resolve(process.cwd(), '../../packages'),
      },
    },
    define: {
      // Mock Next.js env variables
      'process.env.NODE_ENV': '"test"',
      'process.env.NEXT_PUBLIC_API_URL': '"http://localhost:3001"',
    },
    ...overrides,
  })
}

export default createNextJSConfig()
