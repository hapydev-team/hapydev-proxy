import { assign, get, isArray, isEmpty, isNull, isObject, isString, toLower } from 'lodash';
import { Requester } from '../../types/options';
import { ApiRequest } from '../../types/collection';
import { btoa } from 'buffer';
const UrlParse = require('url-parse');
const { minimatch } = require('minimatch');

//自定义代理
const getCustomProxy = (requestUrl, runtimeRequester: Requester) => {
  const customConfig = runtimeRequester?.proxy?.custom;
  if (customConfig?.is_used !== 1) {
    return null;
  }

  // 检查host 是不是在 bypass 里面忽略的代理
  const byPassArray = isString(customConfig?.proxy_bypass)
    ? customConfig?.proxy_bypass?.split(',')
    : [];
  const bypassMatch = byPassArray?.find((item) => minimatch(toLower(requestUrl?.host), item));
  if (bypassMatch) {
    return null;
  }
  // 检查当前协议是否匹配 protocol
  const protocolsArray = isArray(customConfig?.proxy_type) ? customConfig?.proxy_type : [];
  const protocolMatch = protocolsArray?.find(
    (item) => toLower(requestUrl?.protocol) === `${toLower(item)}:`
  );
  if (!protocolMatch) {
    return null;
  }

  const result = {
    host: customConfig?.proxy_url,
    port: customConfig?.proxy_port,
  };

  //若使用了代理认证
  if (customConfig?.auth?.is_used === 1) {
    assign(result, {
      proxyAuth: `Basic ${btoa(`${customConfig?.auth?.username}:${customConfig?.auth?.password}`)}`,
    });
  }
  return result;
};

// 系统代理
//no_proxy：不使用代理的主机或IP。
//http_proxy：http协议使用代理服务器地址
//https_proxy：https协议使用安全代理地址
const getSystemProxy = (requestUrl, apiRequest: ApiRequest, runtimeRequester: Requester) => {
  const systemConfifg = runtimeRequester?.proxy?.system;
  if (systemConfifg?.is_used !== 1) {
    return null;
  }

  const NoProxyArray =
    isString(process?.env?.NO_PROXY) && systemConfifg?.env_first === 1
      ? process?.env?.NO_PROXY.split(',')
      : [];
  const noProxyIndex = NoProxyArray.findIndex((item) => minimatch(toLower(requestUrl.host), item));
  if (noProxyIndex !== -1) {
    return null;
  }
  const result = {};
  if (systemConfifg?.env_first == 1 || isEmpty(get(process, 'versions.electron'))) {
    const env_proxy =
      requestUrl?.protocol == 'https:' ? process.env?.HTTPS_PROXY : process.env?.HTTP_PROXY;

    if (isString(env_proxy) && !isEmpty(env_proxy)) {
      let env_proxy_parse: any = new UrlParse(env_proxy);
      assign(result, {
        host: env_proxy_parse?.hostname ?? '',
        port: parseInt(env_proxy_parse?.port, 10) > 0 ? parseInt(env_proxy_parse?.port, 10) : 0,
      });
    }
  }
  if (!isEmpty(get(process, 'versions.electron'))) {
    let value: any = require('electron').session.defaultSession.resolveProxy(apiRequest?.url);
    let match: any = value.match(/PROXY (([^:]+):(\d+))/);

    if (isObject(match) && isString(match[2]) && !isEmpty(match[2]) && parseInt(match[3], 10) > 0) {
      assign(result, {
        host: match[2],
        port: parseInt(match[3], 10),
      });
    }
  }

  //若使用了认证
  if (systemConfifg?.auth?.is_used === 1) {
    assign(result, {
      proxyAuth: `Basic ${btoa(
        `${systemConfifg?.auth?.username}:${systemConfifg?.auth?.password}`
      )}`,
    });
  }
  return result;
};

const formatProxys = (requestUrl, apiRequest: ApiRequest, runtimeRequester: Requester) => {
  //优先使用自定义代理
  let proxy: any = getCustomProxy(requestUrl, runtimeRequester);
  if (isNull(proxy)) {
    proxy = getSystemProxy(requestUrl, apiRequest, runtimeRequester);
  }

  if (isNull(proxy)) {
    return null;
  }
  return proxy;
};

export default formatProxys;
