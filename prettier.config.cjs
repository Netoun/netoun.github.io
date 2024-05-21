/** @type {import("prettier").Config} */
module.exports = {
    // i am just using the standard config, change if you need something else
    ...require('prettier-config-standard'),
    singleQuote: false,
    semi: false,
    pluginSearchDirs: [__dirname],
    plugins: [require.resolve('prettier-plugin-astro'),
        "@ianvs/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss"],
    tailwindConfig: 'tailwind.config.cjs',
    importOrder: [
        "<THIRD_PARTY_MODULES>",
        "",
        "",
        "^@utils/(.*)$",
        "^@components/(.*)$",
        "^~/(.*)$",
        "^[./]",
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro'
            }
        }
    ]
}