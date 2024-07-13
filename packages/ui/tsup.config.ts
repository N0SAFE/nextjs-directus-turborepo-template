import defineTsupConfig from '@repo/tsup-config'

export default defineTsupConfig((options) => ({
    entry: ['./src/**/*.{ts,tsx}'],
    format: ['esm', 'cjs'],
    clean: process.env.NODE_ENV === 'production',
    minify: true,
    external: ['react', 'react-dom', 'next'],
    ...options,
}))
