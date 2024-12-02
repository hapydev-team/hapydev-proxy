import { endsWith, isString, replace, startsWith, toLower, trim } from 'lodash';
import urlJoin from 'url-join';

export const getWebsocketUrl = (env_url, request_url) => {
  let pre_url = trim(env_url);
  let result = trim(request_url);

  // 拼接环境前置URl
  if (isString(pre_url) && pre_url.length > 0) {
    if (!startsWith(toLower(pre_url), 'wss://') && !startsWith(toLower(pre_url), 'ws://')) {
      pre_url = `ws://${pre_url}`;
    }
    result = urlJoin(pre_url, result);
    if (endsWith(pre_url, '/')) {
      result = replace(result, `${pre_url}:`, `${pre_url.substr(0, pre_url.length - 1)}:`);
    } else {
      result = replace(result, `${pre_url}/:`, `${pre_url}:`);
    }
  } else if (!startsWith(toLower(result), 'wss://') && !startsWith(toLower(result), 'ws://')) {
    result = `ws://${result}`;
  }
  return result;
};
