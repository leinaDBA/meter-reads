module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'jest', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/typedef': [
      'error',
      {
        arrayDestructuring: true,
        arrowParameter: true,
        memberVariableDeclaration: true,
        objectDestructuring: true,
        parameter: true,
        propertyDeclaration: true,
        variableDeclarationIgnoreFunction: true,
      },
    ],
    'import/prefer-default-export': 'off',
    'no-param-reassign': ['error', { props: false }],
    'prettier/prettier': ['error', { singleQuote: true }],
    'spaced-comment': ['error', 'always', { exceptions: ['*'] }],
  },
  settings: {
    'import/resolver': { node: { extensions: ['.js', '.ts', '.tsx', 'json'] } },
  },
};
