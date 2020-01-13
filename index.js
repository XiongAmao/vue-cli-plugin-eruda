const plugin = require('./src/webpackPlugin')

module.exports = (api, projectOptions) => {
  const { pluginOptions: { eruda } = { eruda: {} } } = projectOptions

  api.configureWebpack((webpackConfig) => {
    webpackConfig.plugins.push(new plugin(eruda))
  })
}
