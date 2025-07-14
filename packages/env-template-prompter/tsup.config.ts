import { defineConfig } from 'tsup';

export default defineConfig([
  // Main library ESM build
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    target: 'node18',
    splitting: false,
    treeshake: true,
    minify: false,
    external: ['prompts', 'dotenv', 'dotenv-expand', 'picocolors']
  },
  // CLI ESM build with shebang
  {
    entry: ['src/cli/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    outDir: 'dist/cli',
    target: 'node18',
    splitting: false,
    treeshake: true,
    minify: false,
    external: ['prompts', 'dotenv', 'dotenv-expand', 'picocolors'],
    banner: {
      js: '#!/usr/bin/env node'
    }
  },
  // CJS build for compatibility
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    outDir: 'dist',
    outExtension: () => ({ js: '.cjs' }),
    target: 'node18',
    splitting: false,
    treeshake: true,
    minify: false,
    external: ['prompts', 'dotenv', 'dotenv-expand', 'picocolors']
  }
]);
