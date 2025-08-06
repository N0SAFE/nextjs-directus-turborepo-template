/// <reference types="vitest" />
const { defineConfig } = require('vitest/config')

/**
 * Base Vitest configuration for all packages
 */
const createBaseConfig = (overrides = {}) => {
  return defineConfig({
    test: {
      globals: true,
      environment: 'node',
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        reportsDirectory: './coverage',
        clean: true,
        exclude: [
          'coverage/**',
          'dist/**',
          '**/[.]**',
          'packages/*/test{,s}/**',
          '**/*.d.ts',
          '**/virtual:*',
          '**/__x00__*',
          '**/\x00*',
          'cypress/**',
          'test{,s}/**',
          'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
          '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
          '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
          '**/tests/**',
          '**/__tests__/**'
        ]
      },
      // Common setup files
      setupFiles: [],
      // Timeout settings
      testTimeout: 10000,
      hookTimeout: 10000,
    },
    resolve: {
      alias: {
        '@': './src',
        '~': './',
      },
    },
    ...overrides,
  })
}

const defaultConfig = createBaseConfig()

module.exports = defaultConfig
module.exports.createBaseConfig = createBaseConfig
module.exports.default = defaultConfig
