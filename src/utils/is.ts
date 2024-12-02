const JSON5 = require('json5');

import { isObject } from 'lodash';
import { DOMParser } from 'xmldom';

export const isXml = function (val: any) {
  try {
    const element = new DOMParser().parseFromString(val, 'text/xml')?.documentElement;
    return isObject(element);
  } catch (ex) {
    return false;
  }
};
export const isHtml = (html: string): boolean => {
  try {
    if (typeof html !== 'string') {
      return false;
    }
    html = html.trim();
    const trimmed = html.replace(/^[ \t\n\r]+/, '');
    return (
      Boolean(trimmed) &&
      trimmed.substring(0, 1) === '<' &&
      trimmed.charAt(trimmed.length - 1) === '>'
    );
  } catch (error) {
    return false;
  }
};

export const isJson5 = (str: string): boolean => {
  if (typeof str === 'string') {
    try {
      const obj = JSON5.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};
