import jsLint from '@eslint/js';
import tsLint from '@typescript-eslint/eslint-plugin';
// @ts-ignore
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
// @ts-ignore
import json from 'eslint-plugin-json';
// @ts-ignore
import * as importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import * as mdx from 'eslint-plugin-mdx';
import { resolve } from 'eslint-import-resolver-typescript';

const allowedExtensions = [
  '.util',
  '.type',
  '.service',
  '.config',
  '.collection',
  '.context',
  '.hook',
  '.test',
  '.json',
  '.context',
];

export default [
  jsLint.configs.recommended,
  {
    files: [
      'apps/backend/**/*.ts',
      'apps/frontend/**/*.ts',
      'apps/frontend/**/*.tsx',
    ],
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          resolvePackagePath: (sourcePath) => {
            const matchedExtension = allowedExtensions.find((ext) =>
              sourcePath.endsWith(ext),
            );

            return matchedExtension
              ? resolve(sourcePath, matchedExtension)
              : null;
          },
        },
      },
    },
    ignores: ['node_modules', 'package.json', '**/*.config.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: 'tsconfig.json',
        ecmaFeatures: {
          jsx: true,
          tsx: true,
          modules: true,
          experimentalObjectRestSpread: true,
          impliedStrict: true,
          globalReturn: false,
          allowImportExportEverywhere: false,
          allowHashBang: false,
          allowReserved: false,
          allowReturnOutsideFunction: false,
          allowSuperOutsideMethod: false,
          allowUnderscoreBeforeProperties: false,
          allowUnderscoreBeforeMethodProperties: false,
          allowUnderscoreBeforeClassProperties: false,
          allowUnderscoreBeforeFunctionProperties: false,
          allowUnderscoreBeforePrivateProperties: false,
          allowUnderscoreBeforeProtectedProperties: false,
          allowUnderscoreBeforePublicProperties: false,
          allowUnderscoreBeforeStaticProperties: false,
          allowUnderscoreBeforeStaticMethods: false,
          allowUnderscoreBeforeStaticClassProperties: false,
        },
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        structuredClone: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: {
      jsdoc,
      import: importPlugin,
      json,
      mdx,
      '@typescript-eslint': tsLint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsLint.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      // 'no-console': 'warn',
      'no-debugger': 'warn',
      'no-duplicate-imports': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Enforce consistent indentation (4 spaces in this case)
      // indent: ['warn', 2],
      // Enforce the use of single quotes for strings
      quotes: ['warn', 'single'],
      // Enforce semicolons at the end of statements
      semi: ['error', 'always'],
      // Enforce consistent line breaks (LF for Unix)
      'linebreak-style': ['error', 'unix'],
      // Require the use of === and !== (no implicit type conversions)
      eqeqeq: ['error', 'always'],
      // Enforce a maximum line length (usually 80 or 100 characters)
      'max-len': [
        'warn',
        {
          code: 80,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignorePattern: '^\\s*import\\s+.*\\s+from\\s+["\'].*["\']',
        },
      ],
      // Enable Prettier as a lint rule
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          semi: true,
          singleQuote: true,
        },
      ],
      'import/no-unresolved': 0,
      'import/extensions': 1,
      'import/named': 1,
      'import/namespace': 1,
      'import/default': 1,
      'import/export': 1,
      'jsdoc/require-param': ['warn', { contexts: ['TSParameterProperty'] }],
      'jsdoc/require-param-description': [
        'warn',
        { contexts: ['TSParameterProperty'] },
      ],
      'jsdoc/require-param-name': [
        'warn',
        { contexts: ['TSParameterProperty'] },
      ],
      'jsdoc/require-returns': ['warn', { contexts: ['TSPropertySignature'] }],
      'jsdoc/require-returns-description': [
        'warn',
        { contexts: ['TSPropertySignature'] },
      ],
      'jsdoc/require-returns-type': [
        'warn',
        { contexts: ['TSPropertySignature'] },
      ],
      'jsdoc/require-description': [
        'warn',
        { contexts: ['TSPropertySignature'] },
      ],
    },
  },
];
