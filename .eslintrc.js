module.exports = {
  env: {
    es2020: true,
    node: true,
    jest: true,
    "jest/globals": true,
  },
  extends: ["eslint:recommended", "plugin:jest/recommended", "prettier"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["jest"],
  rules: {
    "no-case-declarations": "off",
  },
};
