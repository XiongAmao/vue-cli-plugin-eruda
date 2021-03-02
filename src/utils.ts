import * as Webpack from 'webpack';
import * as chalk from 'chalk';

export const isType = (type: string) => (val: unknown): boolean => {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
};

export const isString = (val: unknown): val is string => {
  return typeof val === 'string' && isType('String')(val);
};

export const isObject = (val: unknown): val is Record<string, unknown> => {
  return !!val && isType('Object')(val);
};

// only for webpack@4.x
export const isEntry = (val: unknown): val is Webpack.Entry => {
  if (isObject(val)) {
    return Object.values(val).every((value) => {
      return (
        isString(value) ||
        (Array.isArray(value) && value.every((val) => isString(val)))
      );
    });
  }
  return false;
};

export const isRegExp = (val: unknown): val is RegExp => {
  return typeof val === 'object' && isType('RegExp')(val);
};

export const isFunction = (val: unknown): boolean => {
  return typeof val === 'function' && isType('Function')(val);
};

export const isEntryFunc = (val: unknown): val is Webpack.EntryFunc => {
  return typeof val === 'function' && isType('Function')(val);
};

export const log = {
  warn: (msg: string): void => {
    console.warn(chalk.red(msg));
  },
};
