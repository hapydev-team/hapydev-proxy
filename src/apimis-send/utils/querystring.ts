import { DataItem } from '../../types/collection';

const qs = require('querystring');
const { trimEnd, isEmpty } = require('lodash');
const UrlParse = require('url-parse');

// 格式化 query 参数
export const formatQueries = (arr: DataItem[]) => {
  let queries = '';

  if (arr instanceof Array) {
    arr.forEach(function (item) {
      // fixed bug
      if (item.is_used === 1) {
        item.value;
        if (item.value === '') {
          queries += `${item.name}&`;
        } else {
          queries += `${item.name}=${item.value}&`;
        }
      }
    });
  }
  return qs.parse(trimEnd(queries, '&'));
};

export const setQueryString = (uri: string, paras: any) => {
  let urls = new UrlParse(uri);
  let fullPath = urls.href.substr(urls.origin.length);
  let host = urls['host'];
  let baseUri = uri.substr(0, uri.indexOf(urls.query));

  if (urls.query !== '') {
    let queries = qs.parse(urls.query.substr(1));

    fullPath = urls['pathname'] + '?' + qs.stringify(Object.assign(queries, paras));
    uri = baseUri + '?' + qs.stringify(Object.assign(queries, paras));
  } else if (!isEmpty(paras)) {
    fullPath += '?' + qs.stringify(paras);
    uri += '?' + qs.stringify(paras);
  }

  return { uri, host, fullPath, baseUri };
};

export default {
  formatQueries,
  setQueryString,
};
