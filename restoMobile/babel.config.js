module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['dotenv-import', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    }],
    [
      '@babel/plugin-transform-class-properties',
      { loose: true }, // Ensure 'loose' mode is set to true
    ],
    [
      '@babel/plugin-transform-private-methods',
      { loose: true }, // Ensure 'loose' mode is set to true
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      { loose: true }, // Ensure 'loose' mode is set to true
    ],
  ],
};
