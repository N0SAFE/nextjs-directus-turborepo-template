/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { mergeConfig } from 'vite'
import sharedConfig from '@repo/vitest-config'

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      environment: 'node',
      include: ['**/*.test.{ts,js}'],
    },
  })
)
