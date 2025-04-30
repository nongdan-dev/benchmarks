import 'eslint-plugin-only-warn'

import { includeIgnoreFile } from '@eslint/compat'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import importAbsolutePlugin from 'eslint-plugin-no-relative-import-paths'
import preferArrowPlugin from 'eslint-plugin-prefer-arrow'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import importSortPlugin from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import { fileURLToPath } from 'node:url'
import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint'
import tseslint from 'typescript-eslint'

const off = 0
const warn = 1

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))
const ignore = includeIgnoreFile(gitignorePath)

const base: InfiniteDepthConfigWithExtends = {
  files: ['**/*.{ts,tsx,js,jsx,cjs,mjs}'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'react-refresh': reactRefreshPlugin,
    import: importPlugin,
    'simple-import-sort': importSortPlugin,
    'no-relative-import-paths': importAbsolutePlugin,
    'prefer-arrow': preferArrowPlugin,
  },
  rules: {
    // ---------------------------------------------------------------------
    // fixable rules

    // common
    curly: [warn, 'all'],
    quotes: [warn, 'single', { avoidEscape: true }],
    semi: [warn, 'never'],
    'arrow-body-style': [warn, 'as-needed'],
    'no-useless-rename': warn,
    'object-shorthand': [warn, 'always'],
    'one-var': [warn, 'never'],
    'prefer-const': warn,
    'react/jsx-no-useless-fragment': warn,
    'spaced-comment': [warn, 'always', { markers: ['/'] }],

    // import
    'import/first': warn,
    'import/newline-after-import': warn,
    'import/no-duplicates': warn,
    'import/no-extraneous-dependencies': warn,
    // 'import/enforce-node-protocol-usage': warn, // TODO: not released yet

    // import sort
    'sort-imports': off,
    'import/order': off,
    'simple-import-sort/imports': [
      warn,
      {
        groups: [
          ['^\\u0000'],
          ['^@?\\w'],
          ['\\.(s?css|svg|png|jpe?g|gif)$'],
          ['^[^.]'],
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': warn,

    // import type { ... } from
    '@typescript-eslint/consistent-type-imports': warn,
    '@typescript-eslint/no-import-type-side-effects': warn,
    'import/consistent-type-specifier-style': [warn, 'prefer-top-level'],

    // ---------------------------------------------------------------------
    // non-fixable rules

    // common
    'no-return-assign': warn,

    // must use arrow functions
    'prefer-arrow/prefer-arrow-functions': [
      off,
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: true,
      },
    ],
    'prefer-arrow-callback': [warn, { allowNamedFunctions: true }],
    'func-style': [warn, 'expression', { allowArrowFunctions: true }],

    // compatible with typescript
    'no-unused-vars': off,
    '@typescript-eslint/no-unused-vars': [warn, { args: 'none' }],
    'no-shadow': off,
    '@typescript-eslint/no-shadow': warn,

    // restrict export default
    'no-restricted-syntax': [
      warn,
      {
        selector: 'ExportDefaultDeclaration',
        message: 'Prefer named exports',
      },
    ],
  },
}

const importAbsolute: InfiniteDepthConfigWithExtends[] = ['ui'].map(d => ({
  files: base.files?.map(f => `${d}/${f}`),
  rules: {
    // import - no relative import
    'no-relative-import-paths/no-relative-import-paths': [
      warn,
      { allowSameFolder: false, rootDir: `${d}/src`, prefix: '@' },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}))

// eslint-disable-next-line no-restricted-syntax
export default tseslint.config(ignore, base, ...importAbsolute)
