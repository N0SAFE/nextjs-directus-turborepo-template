/// <reference types="vitest" />
const { defineConfig } = require('vitest/config')
const react = require('@vitejs/plugin-react')
const { createBaseConfig } = require('./vitest.config.base')
const path = require('path')

/**
 * Next.js-specific Vitest configuration for web applications
 */
const createNextJSConfig = (overrides = {}) => {
  return createBaseConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.nextjs.js'],
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

const defaultConfig = createNextJSConfig()

module.exports = defaultConfig
module.exports.createNextJSConfig = createNextJSConfig
module.exports.default = defaultConfig
