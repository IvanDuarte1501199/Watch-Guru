module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/default': 'error',
    'import/namespace': 'error',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: '*' }, // Asegura que haya una línea en blanco entre bloques de código
      { blankLine: 'never', prev: 'import', next: 'import' }, // No permite líneas en blanco entre importaciones
      { blankLine: 'always', prev: 'import', next: '*' }, // Asegura que haya una línea en blanco entre las importaciones y el código
    ],
  },
};
