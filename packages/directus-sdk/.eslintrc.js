module.exports = {
    root: true,
    extends: ['@repo/eslint-config/library.js'],
    overrides: [
        {
            files: ['*.ts'],
            rules: {
                '@typescript-eslint/no-namespace': 'error',
            },
        },
    ],
}
