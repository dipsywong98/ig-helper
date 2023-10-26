const common = {
  transform: {
    '.+\\.(j|t)sx?$': [
      'esbuild-jest',
      {
        sourcemap: true,
        target: 'node16',
      },
    ],
  },
}

module.exports = {
  projects: [{
    ...common,
    setupFiles: ['./setEnv.js'],
    displayName: 'server',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/test/**/*.test.*'],
  }, {
    ...common,
    displayName: 'client',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/src/client/**/*.test.*'],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    },
  }]
};
