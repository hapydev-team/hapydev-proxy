import { isArray } from 'lodash';
import { DataItem } from '../../types/collection';

const { mapKeys, toLower, trim } = require('lodash');

// 格式化headers参数
const formatRequestHeaders = (arr: DataItem[], mode: string) => {
  let headers: any = {
    'User-Agent': `Apimis-Send/ ${process.env.npm_package_version} (https://www.apimis.com)`,
    'Cache-Control': 'no-cache',
  };

  if (isArray(arr)) {
    arr.forEach(function (item) {
      if (item.is_used === 1 && trim(item.name) != '') {
        let headerKey = item.name;
        mapKeys(headers, function (v: any, k: any) {
          if (toLower(k) == toLower(headerKey)) {
            delete headers[k];
          }
        });
        headers[trim(headerKey)] = item.value;
      }
    });
  }

  return headers;
};

export default formatRequestHeaders;
