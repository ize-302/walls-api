/** @type {import('jest').Config} */
const config = {
  testTimeout: 100000,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/__tests__/index.test.js',
  ],
  verbose: true,
  forceExit: true,
};

export default config;