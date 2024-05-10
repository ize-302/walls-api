/** @type {import('jest').Config} */
const config = {
  testTimeout: 100000,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ["**/**/*.test.js", "**/**/*.spec.js"],
  verbose: true,
  forceExit: true,
};

export default config;