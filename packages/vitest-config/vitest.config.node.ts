import { defineConfig } from 'vitest/config'
import path from 'path'
import { createBaseConfig } from './vitest.config.base'

/**
 * Node.js-specific Vitest configuration for backend/utility packages
 */
export const createNodeConfig = (overrides = {}) => {
  const baseConfig = createBaseConfig({
    test: {
      environment: 'node',
      setupFiles: ['./vitest.setup.node.ts'],
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

export default createNodeConfig()
