module.exports = function (api) {
  api.cache(true);
  const  presets = [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": [
            "ie>=11",
            "chrome>=62"
          ],
          "node": "8.9.0",
          "safari": "11.1"
        },
        "modules": false,
        "debug": true,
        "useBuiltIns": "usage"
      }
    ]
  ]
  const plugins =  []

  return {
    presets,
    plugins
  };
}