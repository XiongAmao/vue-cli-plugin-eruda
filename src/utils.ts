import * as chalk from 'chalk';
import {
  ForkEntryDescription,
  ForkEntryFunc,
  ForkEntryItem,
  ForkEntryObject,
} from './types';

export const hasOwn = (val: unknown, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(val, key);

export const isType =
  (type: string) =>
  (val: unknown): boolean => {
    return Object.prototype.toString.call(val) === `[object ${type}]`;
  };

export const isString = (val: unknown): val is string => {
  return typeof val === 'string';
};

export const isPlainObject = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === 'object';
};

// only for webpack@4.x
export const isEntry = (val: unknown): val is ForkEntryObject => {
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

// for webpack 4
export const isEntryItem = (val: unknown): val is ForkEntryItem => {
  return isString(val) || (Array.isArray(val) && val.every((e) => isString(e)));
};

// work in webpack 5
export const isEntryDescription = (
  val: unknown
): val is ForkEntryDescription => {
  return isPlainObject(val) && hasOwn(val, 'import');
};

export const isEntryObject = (val: unknown): val is ForkEntryObject => {
  if (isPlainObject(val)) {
    return Object.values(val).every((innerVal) => {
      return isEntryItem(innerVal) || isEntryDescription(innerVal);
    });
  }
  return false;
};

export const isRegExp = (val: unknown): val is RegExp => {
  return isPlainObject(val) && isType('RegExp')(val);
};

export const isEntryFunc = (val: unknown): val is ForkEntryFunc => {
  return typeof val === 'function';
};

export const log = {
  warn: (msg: string): void => {
    console.warn(chalk.red(msg));
  },
};
