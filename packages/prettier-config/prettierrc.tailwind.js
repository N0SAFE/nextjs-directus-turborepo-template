const BaseConfig = require("./prettierrc.base");

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
module.exports = {
    ...BaseConfig,
    plugins: [...BaseConfig.plugins || [], "prettier-plugin-tailwindcss"]
};;
