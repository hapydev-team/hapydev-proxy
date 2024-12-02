const JSON5 = require('json5');

const isJson5 = (str: string): boolean => {
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

export default isJson5;
