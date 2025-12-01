module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'react-app',
    'react-app/jest',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'warn',
    'react/no-unescaped-entities': 'off',
    'no-unused-vars': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
