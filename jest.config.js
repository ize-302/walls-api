/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.js"],
  verbose: true,
  forceExit: true
};

module.exports = config;