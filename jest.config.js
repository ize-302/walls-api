/** @type {import('jest').Config} */
const config = {
  testTimeout: 100000,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/__tests__/*.(test).{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/?(*.)(spec|test).{js,jsx,ts,tsx}'
  ],
  verbose: true,
  forceExit: true,
};

export default config;