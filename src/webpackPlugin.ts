import {
  ForkEntryItem,
  ForkEntryObject,
  ForkWebpackCompiler,
  ForkWebpackEntry,
  VueCliPluginErudaOptions,
} from './types';

import * as fs from 'fs-extra';
import * as path from 'path';
import {
  isEntryDescription,
  isEntryFunc,
  isEntryItem,
  isPlainObject,
  isRegExp,
  isString,
  log,
} from './utils';

import { camelCase } from 'camel-case';

class ErudaWebpackPlugin {
  options: Omit<Required<VueCliPluginErudaOptions>, 'exclude' | 'defaults'> & {
    exclude: string[] | RegExp[];
    defaults?: VueCliPluginErudaOptions['defaults'];
    isCli5?: boolean;
  };
  erudaEntryPath: string;

  constructor(options: VueCliPluginErudaOptions = {}) {
    const isProdEnv = process.env.NODE_ENV === 'production';
    const {
      enable = !isProdEnv,
      plugins = [],
      container = null,
      tool = null,
      autoScale = true,
      useShadowDom = true,
      defaults,
      apiVersion = '',
    } = options;

    let { exclude = [] } = options;
    let isCli5 = false;

    if (isString(exclude)) {
      exclude = [exclude];
    } else if (isRegExp(exclude)) {
      exclude = [exclude];
    } else if (!Array.isArray(exclude)) {
      log.warn(
        `\n[vue-cli-plugin-eruda] Invalid options: "exclude" must be regexp/regexp[] \n`
      );
      exclude = [];
    }

    if (apiVersion) {
      if (Number(apiVersion.split('.')[0]) >= 5) {
        isCli5 = true;
      }
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
      useShadowDom,
      defaults,
      apiVersion,
      isCli5,
    };

    // enable by default when NODE_ENV !== 'production'
    if (this.options.enable) {
      this._writeErudaEntry();
    }
  }

  // https://github.com/webpack/webpack/issues/6516
  _amendEntryWebpack(entry: ForkWebpackEntry): ForkWebpackEntry {
    // vue-cli does not allow function type
    if (isEntryFunc(entry))
      return (...args) =>
        Promise.resolve(entry(...args)).then(
          this._amendEntryWebpack.bind(this)
        );

    // webpack4 string | string[]
    if (isEntryItem(entry)) {
      return this._injectErudaEntryPath(entry);
    }

    if (isPlainObject(entry)) {
      const newEntryObject: ForkEntryObject = {};
      Object.entries(entry).forEach(([key, val]) => {
        // webpack 4
        if (isEntryItem(val)) {
          newEntryObject[key] = this._injectErudaEntryPath(val);
        }
        // webpack 5
        if (isEntryDescription(val)) {
          newEntryObject[key] = {
            ...val,
            import: this._injectErudaEntryPath(val.import),
          };
        }
      });

      return newEntryObject;
    }

    return entry;
  }

  _injectErudaEntryPath(entry: ForkEntryItem): ForkEntryItem {
    if (isString(entry)) {
      return this._inExclude([entry]) ? [entry] : [this.erudaEntryPath, entry];
    } else if (Array.isArray(entry)) {
      return this._inExclude(entry) ? entry : [this.erudaEntryPath, ...entry];
    }
    return entry;
  }

  _inExclude(entry: string | string[]): boolean {
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

  _writeErudaEntry(): void {
    const entryPath = path.resolve(__dirname, './eruda-entry.js');
    const pluginStr = this._getPlugin();
    const optionsStr = this._getInitOptions();
    const erudaStr = `var eruda = require("eruda");window.eruda === undefined && (window.eruda = eruda);`;
    const initStr = `eruda.init(${optionsStr});`;
    const fileStr = erudaStr + initStr + pluginStr;
    const cache = fs.existsSync(entryPath)
      ? fs.readFileSync(entryPath).toString()
      : '';

    if (cache !== fileStr) {
      fs.writeFileSync(entryPath, fileStr, {
        encoding: 'utf8',
        flag: 'w',
      });
    }

    this.erudaEntryPath = require.resolve('./eruda-entry.js');
  }

  _getInitOptions(): string {
    const { container, tool, autoScale, useShadowDom, defaults } = this.options;
    const option: {
      container: VueCliPluginErudaOptions['container'];
      autoScale: VueCliPluginErudaOptions['autoScale'];
      useShadowDom: VueCliPluginErudaOptions['useShadowDom'];
      tool?: VueCliPluginErudaOptions['tool'];
      defaults?: VueCliPluginErudaOptions['defaults'];
    } = {
      container,
      autoScale,
      useShadowDom,
      defaults,
    };
    if (tool) option.tool = tool;
    if (defaults) option.defaults = defaults;
    return JSON.stringify(option);
  }

  _getPlugin(): string {
    const plugins = this.options.plugins;
    let pluginsStr = '';

    if (Array.isArray(plugins)) {
      [...plugins].forEach((val) => {
        let pluginName = val;
        let hasModule = false;

        if (!isString(val)) return;
        if (!val.startsWith('eruda')) pluginName = `eruda-${val}`;
        try {
          require.resolve(pluginName);
          hasModule = true;
        } catch (err) {
          log.warn(
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

  apply(compiler: ForkWebpackCompiler): void {
    if (this.options.enable) {
      compiler.options.entry = this._amendEntryWebpack(compiler.options.entry);
    }
  }
}

export default ErudaWebpackPlugin;
