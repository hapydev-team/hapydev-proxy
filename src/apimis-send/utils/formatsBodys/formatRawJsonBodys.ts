const stripJsonComments = require('strip-json-comments');
const JSON5 = require('json5');
import isJson5 from '../is/isJson5';

// 格式化 json 参数
const formatRawJsonBodys = (raw = '') => {
  let bodys = '';

  if (isJson5(raw)) {
    try {
      bodys = stripJsonComments(raw);
    } catch (e) {
      bodys = JSON.stringify(JSON5.parse(raw));
    }
  } else {
    bodys = raw;
  }

  return bodys;
};

export default formatRawJsonBodys;
