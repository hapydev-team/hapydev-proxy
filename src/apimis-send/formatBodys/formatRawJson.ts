import { isJson5 } from '../../utils/is';
const stripJsonComments = require('strip-json-comments');
const JSON5 = require('json5');

// 格式化 json 参数
const formatRawJson = (raw = '') => {
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

export default formatRawJson;
