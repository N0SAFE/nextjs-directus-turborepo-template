import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        rules: {
            // Temporarily disable the problematic rule due to ESLint v9 compatibility issues
            '@next/next/no-duplicate-head': 'off',
            'react-hooks/exhaustive-deps': 'off',
        },
    },
]

export default eslintConfig
