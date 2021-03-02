import * as Webpack from 'webpack';
import * as ChainableConfig from 'webpack-chain';

export type webpackRawConfigFn =
  | ((config: Webpack.Configuration) => Webpack.Configuration | void)
  | Webpack.Configuration;

export type WebpackChainFn = (chainableConfig: ChainableConfig) => void;

export interface PluginAPI {
  configureWebpack(fn: webpackRawConfigFn): void;
  chainWebpack(fn: WebpackChainFn): void;
}

export interface VueCliPluginErudaOptions {
  enable?: boolean;
  exclude?: RegExp | RegExp[] | string | string[];
  plugins?: string[];
  container?: string | null;
  tool?: string | string[] | null;
  autoScale?: boolean;
  useShadowDom?: boolean;
}

export interface ProjectOptions {
  pluginOptions?: {
    eruda?: VueCliPluginErudaOptions;
  };
}

export type WebpackEntry = Webpack.Configuration['entry'];
