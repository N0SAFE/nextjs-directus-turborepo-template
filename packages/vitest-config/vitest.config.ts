import { defineConfig } from 'vitest/config'

/**
 * TypeScript configuration for vitest-config package
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
})
