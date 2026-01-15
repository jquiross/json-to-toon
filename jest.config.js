export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {},
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/backend/$1',
  },
  verbose: true,
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/server.js',
    '!backend/config/**',
  ],
};
