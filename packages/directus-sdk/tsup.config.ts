import defineTsupConfig from '@repo/tsup-config'

export default defineTsupConfig((options) => ({
    entry: ['./src/**/*.{ts,tsx}'],
    format: ['esm', 'cjs'],
    clean: false,
    minify: true,
    external: [],
    ...options,
}))
