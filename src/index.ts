import { PluginAPI, ProjectOptions } from './types';
import plugin from './webpackPlugin';

function ErudaPlugin(api: PluginAPI, projectOptions: ProjectOptions): void {
  const { pluginOptions: { eruda } = { eruda: {} } } = projectOptions;
  console.log(api.version)
  api.chainWebpack((webpackConfig) => {
    webpackConfig.plugin('vue-eruda').use(plugin, [{ ...eruda, apiVersion: api.version }]);
  });
}

module.exports = ErudaPlugin;
