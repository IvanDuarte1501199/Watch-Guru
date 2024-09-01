module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint', 'prettier', 'tailwindcss'],
    rules: {
      'prettier/prettier': ['error', { singleQuote: true, trailingComma: 'all' }],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'tailwindcss/no-custom-classname': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }