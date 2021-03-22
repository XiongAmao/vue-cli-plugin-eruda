import * as Webpack from 'webpack';
import * as chalk from 'chalk';

export const isType = (type: string) => (val: unknown): boolean => {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
};

export const isString = (val: unknown): val is string => {
  return typeof val === 'string';
};

export const isPlainObject = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === 'object';
};

// only for webpack@4.x
export const isEntry = (val: unknown): val is Webpack.Entry => {
  if (isPlainObject(val)) {
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
  return isPlainObject(val) && isType('RegExp')(val);
};

export const isEntryFunc = (val: unknown): val is Webpack.EntryFunc => {
  return typeof val === 'function';
};

export const log = {
  warn: (msg: string): void => {
    console.warn(chalk.red(msg));
  },
};
