// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

import acronisPatterns from './tools/eslint-rules/index.js';

export default tseslint.config(
  // Base ESLint recommended rules
  js.configs.recommended, // TypeScript ESLint recommended rules
  ...tseslint.configs.recommended, // Vue 3 recommended rules
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/storybook-static/**',
      '**/.storybook/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.ts',
      'vite.config.*.ts',
      '**/next-env.d.ts',
      // Next.js build output and Fumadocs generated source (apps/docs).
      '**/.next/**',
      '**/.source/**',
      // Generated, committed token artifacts (built by tools/style-dictionary).
      'packages/tokens-pd/**',
    ],
  }, // General configuration for all files
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  }, // TypeScript files - additional rules
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowObjectTypes: 'always',
        },
      ],
    },
  },
  // React files configuration
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  storybook.configs['flat/recommended'],
  // Usage-pattern enforcement (local plugin). Scoped to application code, where
  // ad-hoc compositions tend to creep in; the library + its demos compose the
  // real components. Each rule encodes a `ui-spec/patterns/*` anti-pattern.
  {
    files: ['apps/**/*.{jsx,tsx}'],
    plugins: { 'acronis-patterns': acronisPatterns },
    rules: {
      'acronis-patterns/no-adhoc-sheet': 'error',
    },
  }
);
