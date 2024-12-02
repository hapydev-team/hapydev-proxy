const { cloneDeep } = require('lodash');
import { ApiRequest, DataItem } from '../../../types/collection';
import formatRawJsonBodys from './formatRawJsonBodys';

// 格式化 请求Body 参数（用于脚本使用）
const formatDisplayRequestBodys = (apihexRequest: ApiRequest) => {
  let _body: any = {
    request_bodys: {},
    raw: {
      mode: 'none',
    },
  };

  let arr: DataItem[] = cloneDeep(apihexRequest?.body?.parameter);

  switch (apihexRequest?.body?.mode) {
    case 'none':
      _body = {
        request_bodys: '',
        raw: {
          mode: 'none',
        },
      };
      break;
    case 'form-data':
      if (arr instanceof Array) {
        let _raw: Array<any> = [];
        arr.forEach(function (item) {
          if (item.is_used === 1) {
            _body.request_bodys[item.name] = item.value;

            if (item.field_type === 'file') {
              _raw.push({
                key: item.name,
                type: 'file',
                src: item.value,
              });
            } else {
              _raw.push({
                key: item.name,
                type: 'text',
                value: item.value,
              });
            }
          }
        });

        _body.raw = {
          mode: 'formdata',
          formdata: _raw,
        };
      }
      break;
    case 'urlencoded':
      if (arr instanceof Array) {
        let _raw: Array<any> = [];
        arr.forEach(function (item) {
          if (item.is_used === 1) {
            _body.request_bodys[item.name] = item.value;

            _raw.push({
              key: item.name,
              value: item.value,
            });
          }
        });

        _body.raw = {
          mode: 'urlencoded',
          urlencoded: _raw,
        };
      }
      break;
    default:
      _body = {
        request_bodys: formatRawJsonBodys(apihexRequest?.body?.raw),
        raw: {
          mode: 'raw',
          raw: formatRawJsonBodys(apihexRequest?.body?.raw),
          options: {
            raw: {
              language: apihexRequest?.body?.mode,
            },
          },
        },
      };
      break;
  }

  return _body;
};

export default formatDisplayRequestBodys;
