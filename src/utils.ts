import { isPlainObject } from 'lodash';
const zlib = require('zlib');

export const gzip = (content) => {
  try {
    if (isPlainObject(content)) {
      return Array.from(zlib.deflateSync(JSON.stringify(content)));
    }
    return Array.from(zlib.deflateSync(content));
  } catch (ex) {
    return null;
  }
};
