const { isArray } = require('lodash');
import formatFormDataBodys from './formatFormDataBodys';
import formatRawJsonBodys from './formatRawJsonBodys';
import formatDisplayRequestBodys from './formatDisplayRequestBodys';
import { ApiRequest } from '../../../types/collection';

export { formatFormDataBodys, formatRawJsonBodys, formatDisplayRequestBodys };

export const formatRawBodys = (raw = '') => {
  let bodys = raw;
  // if(isJson5(raw)){
  //     bodys = JSON.stringify(JSON5.parse(raw));
  // }else{
  //     bodys = raw;
  // }
  return bodys;
};

// 格式化 urlencode 参数
export const formatUrlencodeBodys = (arr: any[]) => {
  let bodys = '';
  if (isArray(arr)) {
    arr.forEach(function (item) {
      if (parseInt(item.is_checked) === 1) {
        if (item.key !== '') {
          bodys += encodeURIComponent(item.key) + '=' + encodeURIComponent(item.value) + '&';
        }
      }
    });
  }
  bodys = bodys.substr(-1) == '&' ? bodys.substr(0, bodys.length - 1) : bodys;
  return bodys;
};

export const formatRequestBodys = (apihexRequest: ApiRequest) => {
  let _body = {};

  switch (apihexRequest?.body.mode) {
    case 'none':
      break;
    case 'form-data':
      break;
    case 'urlencoded':
      _body = {
        form: formatUrlencodeBodys(apihexRequest?.body.parameter),
      };
      break;
    case 'json':
      _body = {
        body: formatRawJsonBodys(apihexRequest?.body.raw),
      };
      break;
    default:
      _body = {
        body: formatRawBodys(apihexRequest?.body.raw),
      };
      break;
  }
  return _body;
};

export default {
  formatRawBodys,
  formatRawJsonBodys,
  formatUrlencodeBodys,
  formatRequestBodys,
  formatFormDataBodys,
  formatDisplayRequestBodys,
};
