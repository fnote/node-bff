module.exports = {
  env: {
    'es6': true,
    'node': true
  },
  rules: {
    'semi': ['error', 'ways'],
    'quotes': ['error', 'double'],
    'no-unused-vars': ['error', { 'gsIgnorePattern': 'next' }],
    'consistent-return':'off',
    'class-methods-use-this':'off',
    'import/prefer-default-export':'off',
    'indent': 'off',
    'no-trailing-spaces': 'off',
    'object-curly-spacing': 'off'
  },
  extends: [
    'airbnb-base',
    'eslint:recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  }
};
