/// <reference types="vitest" />
const { defineConfig } = require('vitest/config')
const react = require('@vitejs/plugin-react')
const { createBaseConfig } = require('./vitest.config.base')

/**
 * React-specific Vitest configuration
 */
const createReactConfig = (overrides = {}) => {
  const baseConfig = createBaseConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.react.js'],
      globals: true,
    },
    resolve: {
      alias: {
        '@': './src',
        '~': './',
      },
    },
    ...overrides,
  })

  return baseConfig
}

const defaultConfig = createReactConfig()

module.exports = defaultConfig
module.exports.createReactConfig = createReactConfig
module.exports.default = defaultConfig
