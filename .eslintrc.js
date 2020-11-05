module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    'max-len': ['error', {
      code: 150,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreComments: true,
    }],
    'no-param-reassign': ['error', { props: false }],
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'consistent-return': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    indent: 'off',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': 'off',
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
};
