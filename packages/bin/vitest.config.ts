/// <reference types="vitest" />
import { defineProject } from 'vitest/config'
import * as path from 'path'

export default defineProject({
    test: {
        name: 'bin',
        environment: 'node',
        include: [
            '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}',
            '**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts}'
        ],
        exclude: [
            'node_modules', 
            'dist',
        ],
        globals: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(process.cwd(), './'),
            '@repo': path.resolve(process.cwd(), '../../packages'),
        },
    },
})
