const contentDisposition = require('content-disposition');
const { isString } = require('lodash');

export const getFileName = (lowerHeaders, resMime) => {
  if (!lowerHeaders.hasOwnProperty('content-disposition')) {
    if (resMime) {
      return `response.${resMime.ext}`;
    }
    return `response.txt`;
  }

  try {
    let disposition = contentDisposition.parse(lowerHeaders['content-disposition']);

    if (isString(disposition?.parameters?.filename)) {
      try {
        return decodeURIComponent(disposition.parameters.filename);
      } catch (e) {
        return disposition.parameters.filename;
      }
    }
  } catch (e) {
    if (resMime) {
      return `response.${resMime.ext}`;
    }
    return `response.txt`;
  }
};
