const path = require('path');
const fs = require('fs-extra');
const camelCase = require('camelcase');
const chalk = require('chalk');
const { isFunction, isObject, isString, isArray } = require('./utils');

class ErudaWebpackPlugin {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        // enable by default when NODE_ENV !== 'production'
        enable: process.env.NODE_ENV !== 'production',
        plugins: []
      },
      options
    );

    if (this.options.enable) {
      this._writeErudaEntry();
    }
  }

  // https://github.com/webpack/webpack/issues/6516
  _amendEntry(entry) {
    // vue-cli does not allow function type
    if (isFunction(entry))
      return (...args) =>
        Promise.resolve(entry(...args)).then(this._amendEntry.bind(this));

    if (isString(entry)) {
      return [this.erudaEntryPath, entry];
    }
    if (isArray(entry)) {
      return [this.erudaEntryPath, ...entry];
    }

    // webpack object entry type: { <key> string | [string] }
    if (isObject(entry)) {
      const obj = {};
      Object.keys(entry).forEach((key) => {
        obj[key] = this._amendEntry(entry[key]);
      });
      return obj;
    }
  }
  _filterEntry() {}

  _writeErudaEntry() {
    const pluginStr = this._getPlugin();
    const erudaStr = `var eruda = require("eruda");window.eruda === undefined && (window.eruda = eruda);`;
    const initStr = `eruda.init();`;
    // TODO: init(config)

    fs.writeFileSync(
      path.resolve(__dirname, './eruda-entry.js'),
      erudaStr + pluginStr + initStr,
      {
        encoding: 'utf8',
        flag: 'w'
      }
    );
    this.erudaEntryPath = require.resolve('./eruda-entry.js');
  }

  _getPlugin() {
    const plugins = this.options.plugins;
    let pluginsStr = '';

    if (isArray(plugins)) {
      [...plugins].forEach((val) => {
        let pluginName = val;
        let hasModule = false;

        if (!isString(val)) return;
        if (!val.startsWith('eruda')) pluginName = `eruda-${val}`;
        try {
          require.resolve(pluginName);
          hasModule = true;
        } catch (err) {
          console.warn(
            chalk.red(
              `\n[vue-cli-plugin-eruda] Error: Cannot find eruda plugin "${val}". \nYou may need to install it.\n`
            )
          );
        }

        if (!hasModule) return;
        const pluginCamelCase = camelCase(pluginName);
        pluginsStr += `var ${pluginCamelCase} = require("${pluginName}");eruda.add(${pluginCamelCase});`;
      });
    }
    return pluginsStr;
  }

  _addToosl() {}

  apply(compiler) {
    if (this.options.enable) {
      compiler.options.entry = this._amendEntry(compiler.options.entry);
    }
  }
}

module.exports = ErudaWebpackPlugin;
