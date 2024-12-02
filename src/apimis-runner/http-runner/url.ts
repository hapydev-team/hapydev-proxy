import { endsWith, isString, replace, startsWith, toLower, trim } from 'lodash';
import urlJoin from 'url-join';

export const getRequestUrl = (env_url, request_url) => {
  let pre_url = trim(env_url);
  let result = trim(request_url);

  // 拼接环境前置URl
  if (isString(pre_url) && pre_url.length > 0) {
    if (!startsWith(toLower(pre_url), 'https://') && !startsWith(toLower(pre_url), 'http://')) {
      pre_url = `http://${pre_url}`;
    }
    result = urlJoin(pre_url, result);
    if (endsWith(pre_url, '/')) {
      result = replace(result, `${pre_url}:`, `${pre_url.substr(0, pre_url.length - 1)}:`);
    } else {
      result = replace(result, `${pre_url}/:`, `${pre_url}:`);
    }
  } else if (!startsWith(toLower(result), 'https://') && !startsWith(toLower(result), 'http://')) {
    result = `http://${result}`;
  }
  return result;
};
