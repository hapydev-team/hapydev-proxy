import { isArray } from 'lodash';
import { PACKAGE_CONFIG } from '../constant';
import { DataItem } from '../../types/collection';

const { mapKeys, toLower, trim } = require('lodash');

// 格式化headers参数
const formatHeaders = (parameter: DataItem[]) => {
  let headers: any = {
    'User-Agent': `Apimis-Send/ ${process.env.npm_package_version} (https://www.apimis.com)`,
    'Cache-Control': 'no-cache',
  };

  if (isArray(parameter)) {
    parameter.forEach((item) => {
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

export default formatHeaders;
