const qCenterIntegrator = require.resolve('jest-qcenter-integrator');

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
    '!**/exception/databaseException.js',
    '!**/dao/**',
    '!**/database/**'
  ],
  transform: {
    '\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  reporters: ['default',
    [qCenterIntegrator,
      {
        release: 'CloudPCI_REG_BUILD',
        project: 'Cloud PCI',
        env: 'EXE',
        module: 'CLOUD_PCI_UNIT',
        feature: 'UNIT_TESTS_BFF',
        updateDashboard: true,
      },
    ],
  ],
};
