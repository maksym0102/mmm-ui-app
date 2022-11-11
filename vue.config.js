module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.FLUENTFFMPEG_COV": false,
      }),
    ],
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js",
      mainProcessWatch: [
        "src/modules/RunUtility.js",
        "src/modules/template/Templator.js",
        "src/modules/DatabaseUtility.js",
        "src/modules/InstallUtility.js",
        "src/modules/DevToolsUtility.js",
      ],
      // Or, for multiple preload files:
      // preload: { preload: 'src/preload.js', otherPreload: 'src/preload2.js' }
    },
  },
};
