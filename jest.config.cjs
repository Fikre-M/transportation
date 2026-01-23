module.exports = {
  testEnvironment: "jsdom",

  // Fix @/ alias
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
