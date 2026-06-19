const baseConfig = require('./jest.base.config');

module.exports = {
  ...baseConfig,
  rootDir: '.',
  testMatch: ['<rootDir>/tests/units/**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!dist/**',
    '!**/*.config.{ts,js}',
  ],
  coverageDirectory: 'coverage',
};
