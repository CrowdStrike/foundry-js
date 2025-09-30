const js = require('@eslint/js');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  // Apply to all JS/TS files
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Browser environment
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        process: 'readonly',
        MessageEvent: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        HTMLAnchorElement: 'readonly',
        ResizeObserver: 'readonly',
        ResizeObserverEntry: 'readonly',
        Window: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // ESLint recommended rules
      ...js.configs.recommended.rules,
      
      // TypeScript ESLint recommended rules
      ...typescriptEslint.configs.recommended.rules,
      
      // Override specific rules to match old config
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
  
  // Configuration files
  {
    files: ['eslint.config.js', '.eslintrc.js', '.prettierrc.js'],
    languageOptions: {
      globals: {
        // Node environment
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  
  // Ignore patterns (equivalent to .eslintignore)
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.eslintcache',
      'coverage/**',
      '*.min.js',
    ],
  },
];