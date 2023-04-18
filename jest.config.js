module.exports = {
  testEnvironment: "jest-environment-jsdom",
  globals: {
    TextEncoder: require("util").TextEncoder,
    TextDecoder: require("util").TextDecoder
  }
};
