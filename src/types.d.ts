import * as Webpack from 'webpack';
import * as ChainableConfig from 'webpack-chain';

export type webpackRawConfigFn =
  | ((config: Webpack.Configuration) => Webpack.Configuration | void)
  | Webpack.Configuration;

export type WebpackChainFn = (chainableConfig: ChainableConfig) => void;

export interface PluginAPI {
  configureWebpack(fn: webpackRawConfigFn): void;
  chainWebpack(fn: WebpackChainFn): void;
  version?: string
}

export interface VueCliPluginErudaOptions {
  enable?: boolean;
  exclude?: RegExp | RegExp[] | string | string[];
  plugins?: string[];
  container?: string | null;
  tool?: string | string[] | null;
  autoScale?: boolean;
  useShadowDom?: boolean;
  defaults?: {
    transparency: number;
    displaySize: number;
    theme: 'Dark' | 'Light';
  },
  apiVersion?: string
}

export interface ProjectOptions {
  pluginOptions?: {
    eruda?: VueCliPluginErudaOptions;
  };
}

export type WebpackEntry = Webpack.Configuration['entry'];
