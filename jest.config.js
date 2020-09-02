module.exports = {
  name: 'cloud-pci-bff',
  verbose: true,
  testRegex: '((\\.|/*.)(test))\\.js?$',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.js',
    '!**/app.js',
    '!**/in.js',
    '!**/initializer.js',
    '!**/config/**',
    '!**/httpClient/**',
    '!**/util/**',
    '!**/exception/cloudPricingDataFetchException.js',
  ],
  transform: {
    '\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
};
