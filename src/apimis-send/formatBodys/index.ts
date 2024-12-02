import { isArray, isPlainObject, isString } from 'lodash';
import { ApiRequest, DataItem } from '../../types/collection';
import formatRawJson from './formatRawJson';
import formatFormData from './formatFormData';
import formatBinary from './formatBinary';
const FormData = require('form-data');

// 格式化 urlencode 参数
const formatUrlencodeData = (parameters: DataItem[]) => {
  let bodys = '';
  if (!isArray(parameters)) {
    return bodys;
  }
  parameters.forEach(function (item) {
    if (item.is_used === 1) {
      if (item.name !== '' && isString(item?.value)) {
        bodys += `${encodeURIComponent(item.name)}=${encodeURIComponent(item?.value)}&`;
      }
    }
  });
  bodys = bodys.substr(-1) == '&' ? bodys.substr(0, bodys.length - 1) : bodys;
  return bodys;
};

// 格式化 请求Body 参数
const formatBodys = (apiRequest: ApiRequest) => {
  let result: any = {};
  switch (apiRequest.body?.mode) {
    case 'none':
      break;
    case 'form-data':
      try {
        const form: any = new FormData();
        formatFormData(form, apiRequest?.body?.parameter);
        result = {
          body: form,
          header: form.getHeaders(),
        };
      } catch (e) {
        result = {
          error: String(e),
        };
      }
      break;
    case 'urlencoded':
      result = {
        body: formatUrlencodeData(apiRequest.body?.parameter),
        header: {
          'content-type': `application/x-www-form-urlencoded`,
        },
      };
      break;
    case 'binary':
      if (isPlainObject(apiRequest?.body?.binary)) {
        const binaryResult = formatBinary(apiRequest?.body?.binary);
        if (result !== null) {
          result = {
            body: binaryResult?.body,
            header: {
              'content-type': binaryResult?.mime || 'application/octet-stream',
            },
          };
        }
      }
      break;
    case 'plain':
      result = {
        header: {
          'content-type': `text/plain`,
        },
        body: formatRawJson(apiRequest?.body?.raw),
      };
      break;
    case 'javascript':
      result = {
        header: {
          'content-type': 'application/javascript',
        },
        body: formatRawJson(apiRequest?.body?.raw),
      };
      break;
    case 'json':
      result = {
        header: {
          'content-type': 'application/json',
        },
        body: formatRawJson(apiRequest?.body?.raw),
      };
      break;
    case 'html':
      result = {
        header: {
          'content-type': 'text/html',
        },
        body: formatRawJson(apiRequest?.body?.raw),
      };
      break;
    case 'xml':
      result = {
        header: {
          'content-type': 'application/xml',
        },
        body: formatRawJson(apiRequest?.body?.raw),
      };
      break;
    default:
      result = {
        body: formatRawJson(apiRequest?.body?.raw),
      };
      break;
  }
  return result;
};

export default formatBodys;
