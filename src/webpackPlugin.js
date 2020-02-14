const path = require('path');
const fs = require('fs-extra');
const { camelCase } = require('camel-case');
const {
  isFunction,
  isObject,
  isString,
  isArray,
  logWarn,
  isRegExp
} = require('./utils');

class ErudaWebpackPlugin {
  constructor(options = {}) {
    const isProdEnv = process.env.NODE_ENV === 'production';
    const {
      enable = !isProdEnv,
      plugins = [],
      container = null,
      tool = null,
      autoScale = true,
      useShadowDom = true
    } = options;

    let { exclude = [] } = options;

    if (isString(exclude) || isRegExp(exclude)) {
      exclude = [exclude];
    } else if (!isArray(exclude)) {
      logWarn(
        `\n[vue-cli-plugin-eruda] Invalid options: "exclude" must be regexp/regexp[] \n`
      );
      exclude = [];
    }

    this.options = {
      // plugin options
      enable,
      plugins,
      exclude,

      // eruda init options
      container,
      tool,
      autoScale,
      useShadowDom
    };

    // enable by default when NODE_ENV !== 'production'
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

    // webpack object entry type: { <key> string | [string] }
    if (isObject(entry)) {
      const obj = {};
      Object.keys(entry).forEach((key) => {
        obj[key] = this._amendEntry(entry[key]);
      });
      return obj;
    }

    if (isString(entry)) {
      return this._inExclude([entry]) ? [entry] : [this.erudaEntryPath, entry];
    }
    if (isArray(entry)) {
      return this._inExclude(entry) ? entry : [this.erudaEntryPath, ...entry];
    }
  }

  _inExclude(entry) {
    const { exclude = [] } = this.options;
    for (let i = 0; i < exclude.length; i++) {
      const rule = exclude[i];

      for (let j = 0; j < entry.length; j++) {
        const path = entry[j];
        if (
          (isString(rule) && path.startsWith(rule)) ||
          (isRegExp(rule) && rule.test(path))
        ) {
          return true;
        }
      }
    }
    return false;
  }

  _writeErudaEntry() {
    const pluginStr = this._getPlugin();
    const optionsStr = this._getInitOptions();
    const erudaStr = `var eruda = require("eruda");window.eruda === undefined && (window.eruda = eruda);`;
    const initStr = `eruda.init(${optionsStr});`;

    fs.writeFileSync(
      path.resolve(__dirname, './eruda-entry.js'),
      erudaStr + initStr + pluginStr,
      {
        encoding: 'utf8',
        flag: 'w'
      }
    );
    this.erudaEntryPath = require.resolve('./eruda-entry.js');
  }

  _getInitOptions() {
    const { container, tool, autoScale, useShadowDom } = this.options;
    const option = {
      container,
      autoScale,
      useShadowDom
    };
    if (tool) option.tool = tool;
    return JSON.stringify(option);
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
          logWarn(
            `\n[vue-cli-plugin-eruda] Error: Cannot find eruda plugin "${val}". \nYou may need to install it.\n`
          );
        }

        if (!hasModule) return;
        const pluginCamelCase = camelCase(pluginName);
        pluginsStr += `var ${pluginCamelCase} = require("${pluginName}");eruda.add(${pluginCamelCase});`;
      });
    }
    return pluginsStr;
  }

  apply(compiler) {
    if (this.options.enable) {
      compiler.options.entry = this._amendEntry(compiler.options.entry);
    }
  }
}

module.exports = ErudaWebpackPlugin;
