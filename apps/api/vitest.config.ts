import { defineConfig } from 'vitest/config'
import * as path from 'path'

export default defineConfig({
  test: {
    name: 'api',
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: ['node_modules', 'dist', 'uploads', 'database'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      '~': path.resolve(process.cwd(), './'),
    },
  },
})
