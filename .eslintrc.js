module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jquery: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: 'module',
  },
  rules: {
    indent: [1, 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-undef': 1,
    'no-console': 1,
    'no-unused-vars': 1,
    'max-len': 80,
  },
};
