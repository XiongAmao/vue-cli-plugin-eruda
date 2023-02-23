import * as ChainableConfig from 'webpack-chain';

export type WebpackChainFn = (chainableConfig: ChainableConfig) => void;

export interface PluginAPI {
  chainWebpack(fn: WebpackChainFn): void;
  version?: string;
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
  };
  apiVersion?: string;
}

export interface ProjectOptions {
  pluginOptions?: {
    eruda?: VueCliPluginErudaOptions;
  };
}

// webpack4
export type ForkEntryItem = string | string[];
// webpack5 only
export interface ForkEntryDescription {
  import: string | string[];
  [index: string]: any;
}
export interface ForkEntryObject {
  [name: string]: ForkEntryItem | ForkEntryDescription;
}

export type ForkEntryFunc = () =>
  | string
  | string[]
  | ForkEntryObject
  | Promise<string | string[] | ForkEntryObject>;

export type ForkWebpackEntry =
  | string
  | string[]
  | ForkEntryObject
  | ForkEntryFunc
  | undefined;

export interface ForkWebpackCompiler {
  options: {
    entry?: ForkWebpackEntry;
  };
}
