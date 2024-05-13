/** @type {import('jest').Config} */
const config = {
  testTimeout: 110000,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/__tests__/index.test.js',
  ],
  verbose: true,
  forceExit: true,
};

export default config;