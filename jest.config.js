/** @type {import('jest').Config} */
const config = {
  testTimeout: 100000,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.js", "**/**/*.spec.js"],
  verbose: true,
  forceExit: true,
  testEnvironment: 'jsdom',
};

export default config;