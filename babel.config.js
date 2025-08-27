module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@src': './src',
          test: './test',
          underscore: 'lodash',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
