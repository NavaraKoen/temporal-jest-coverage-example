export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['lib', 'mocha'],
  clearMocks: true,
  collectCoverage: true,
  coverageReporters: ['text', 'json', 'cobertura', 'lcov'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/lib/'],
  coverageProvider: 'babel',
};