module.exports = {
  root: true,
  extends: [
    '@react-native-community/eslint-config', // Default RN config
    'eslint-config-prettier' // Installed in step 3
  ],
  parser: '@typescript-eslint/parser', // Installed in step 2
  plugins: [
    '@typescript-eslint', // Installed in step 2
    'react', // Installed in step 1
    'react-native' // Installed in step 1
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'project': './tsconfig.json' // Required for Standard plugin
  },
  'env': {
    'react-native/react-native': true
  },
  'rules': {
    'prettier/prettier': 'off', // Turn off prettier
    // These are the rules that I use
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'off',
    'react-native/no-raw-text': ['off', {
      skip: ['CustomText']
    }],
    "react-native/no-single-element-style-arrays": "warn",
    'object-curly-spacing': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/require-array-sort-compare': ['error', {
      ignoreStringArrays: true
    }],
    'react/jsx-curly-spacing': ['error', {
      when: 'always',
      allowMultiline: true,
      children: true
    }],
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': 'error',
    semi: ['error', 'always'],
    // Indent with 2 spaces
    indent: ['error', 2],
    // Indent JSX with 2 spaces
    'react/jsx-indent': ['error', 2],
    "no-unused-vars": "error",
    // Indent props with 2 spaces
    'react/jsx-indent-props': ['error', 2],
    'react/no-unstable-nested-components' : 'off'
  }
};
