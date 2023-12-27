module.exports = {
    moduleFileExtensions: [
      "js",
      "json",
      "ts"
    ],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    rootDir: "./",
    testRegex: ".*\\.(spec|e2e-spec)\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
      "src/**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    collectCoverage: true,
    coverageThreshold: {
      global: {
        "branches": 75,
        "functions": 75,
        "lines": 75,
        "statements": 75
      }
    }
  };