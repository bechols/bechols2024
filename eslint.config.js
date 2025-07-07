import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Global ignores and base JS config
  {
    ignores: ['dist', 'node_modules']
  },
  js.configs.recommended,

  // TypeScript files
  ...tseslint.config({
    files: ['**/*.ts', '**/*.tsx'],
    extends: tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __GIT_COMMIT_SHA__: 'readonly'
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }),

  // JavaScript files
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly'
      }
    },
    rules: {
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }
);