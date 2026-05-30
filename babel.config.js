// Learn more: https://docs.expo.dev/guides/customizing-babel-config/

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      'react-native-reanimated/plugin', // Reanimated MUST be last
    ],
  };
};
