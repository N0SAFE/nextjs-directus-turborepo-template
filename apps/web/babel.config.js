module.exports = {
    presets: [['next/babel']], // add this config to your babel.config.js for the declare ['constructor']: typeof Class to be used
    plugins: [
        [
            '@babel/plugin-transform-typescript',
            {
                allowDeclareFields: true,
            },
        ],
    ],
}
