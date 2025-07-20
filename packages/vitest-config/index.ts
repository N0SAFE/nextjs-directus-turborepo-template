// Default export for vitest-config package
// This exports the base configuration as the default

const baseConfig = require('./vitest.config.base.ts')

module.exports = baseConfig.default
module.exports.createBaseConfig = baseConfig.createBaseConfig
