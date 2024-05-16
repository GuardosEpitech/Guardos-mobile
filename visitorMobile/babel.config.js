module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env",
        "blocklist": null,
        "allowlist": null,
        "safe": false,
        "allowUndefined": true,
        "verbose": false
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
    ]
  };
};
