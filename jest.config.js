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
        release: process.env.QC_BUILD || 'CloudPCI_REG_BUILD',
        project: 'PRCP-CLOUD PCI',
        env: process.env.QC_ENV || 'EXE',
        module: 'CLOUD_PCI_UNIT',
        feature: 'UNIT_TESTS_BFF',
        updateDashboard: (process.env.QC_SUBMIT && process.env.QC_SUBMIT === 'true') || false,
      },
    ],
  ],
};
