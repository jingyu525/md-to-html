module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.jest.json'
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(mermaid|unified|remark-parse|vfile|trough|bail|is-plain-obj|unist-util-is|unist-util-stringify-position|unist-util-visit|unist-util-visit-parents|unist-util-from|@mermaid-js|d3|khroma)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}
