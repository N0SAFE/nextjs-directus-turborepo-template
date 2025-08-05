const { defineConfig } = require('vitest/config')

/**
 * JavaScript configuration for vitest-config package
 */
const defaultConfig = defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
})

module.exports = defaultConfig
module.exports.default = defaultConfig
