import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Optional setup file
  moduleNameMapper: {
    // Handle CSS Modules (if you use them)
    '\\.module\\.(css|scss|sass)$': 'identity-obj-proxy',
    // Handle static assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js', // You might need to create this mock
    // Handle CSS files (if you import them directly)
    '\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js', // You might need to create this mock
    // Alias configuration (if you use path aliases in tsconfig, match them here)
    // Example: '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.app.json', // Make sure this points to your TS config for the app
    }],
  },
  // Ignore transform for node_modules, except for specific modules if needed
  transformIgnorePatterns: ['/node_modules/'],
  verbose: true,
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};

export default config; 