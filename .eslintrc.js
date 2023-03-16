module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:prettier/recommended'],
  ignorePatterns: ['dist'],
  // add your custom rules here
  rules: {
    'max-len': 0,
    'no-console': process.env.NODE_ENV !== 'production' ? 'warn' : 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
  },
};
