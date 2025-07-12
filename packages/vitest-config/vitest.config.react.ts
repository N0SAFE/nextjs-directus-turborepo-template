/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { createBaseConfig } from './vitest.config.base'

/**
 * React-specific Vitest configuration
 */
export const createReactConfig = (overrides = {}) => {
  const baseConfig = createBaseConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.react.ts'],
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

export default createReactConfig()
