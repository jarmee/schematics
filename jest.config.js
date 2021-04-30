module.exports = {
  preset: "ts-jest/presets/js-with-babel",
  testEnvironment: "node",
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!lodash-es)"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
    },
  },
  moduleNameMapper: {
    "^lodash-es$": "lodash",
  },
};
