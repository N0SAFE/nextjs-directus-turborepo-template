import { defineProject } from 'vitest/config'
import * as path from 'path'

export default defineProject({
    test: {
        name: 'directus-sdk',
        environment: 'node',
        include: [
            '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}',
            '**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts}'
        ],
        exclude: ['node_modules', 'dist', 'indirectus/cache'],
        globals: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(process.cwd(), './src'),
            '~': path.resolve(process.cwd(), './'),
        },
    },
})
