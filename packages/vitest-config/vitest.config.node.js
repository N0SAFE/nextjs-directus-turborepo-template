const { defineConfig } = require('vitest/config')
const path = require('path')
const { createBaseConfig } = require('./vitest.config.base')

/**
 * Node.js-specific Vitest configuration for backend/utility packages
 */
const createNodeConfig = (overrides = {}) => {
  const baseConfig = createBaseConfig({
    test: {
      environment: 'node',
      setupFiles: ['./vitest.setup.node.js'],
      globals: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), './src'),
        '~': path.resolve(process.cwd(), './'),
      },
    },
    ...overrides,
  })

  return baseConfig
}

const defaultConfig = createNodeConfig()

module.exports = defaultConfig
module.exports.createNodeConfig = createNodeConfig
module.exports.default = defaultConfig

// ES module compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports.__esModule = true
  module.exports.createNodeConfig = createNodeConfig
}
