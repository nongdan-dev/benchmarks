/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
module.exports = {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  objectWrap: 'preserve',
  bracketSameLine: true,
  proseWrap: 'always',
  arrowParens: 'avoid',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
}
