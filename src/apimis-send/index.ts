const request = require('postman-request'),
  JSON5 = require('json5'),
  UrlParse = require('url-parse'),
  parsers = require('www-authenticate').parsers,
  ntlm = require('httpntlm').ntlm,
  urlNode = require('url');
const Validator = require('jsonschema').validate;
import utils from './utils';
import { REQUEST_SCHEMA } from './schema';
import { ApiRequest } from '../types/collection';
import urlJoin from 'url-join';
import formatBodys from './formatBodys';
import {
  cloneDeep,
  inRange,
  isEmpty,
  isFunction,
  isNull,
  isObject,
  isPlainObject,
  isString,
  isUndefined,
  startsWith,
  toInteger,
  toLower,
} from 'lodash';
import formatHeaders from './formatHeaders';
import createAuthHeaders from './createAuthHeaders';
import formatProxys from './formatProxys';
import formatHttps from './formatHttps';
import formatCookies from './formatCookies';
import { ApiOptions } from '../types/options';

export default class ApimisSend {
  requestloop: number;
  requestLink: any;
  options: ApiOptions;

  // 构造函数
  constructor(opts?: any) {
    if (!opts) {
      opts = {};
    }
    this.options = opts;
    this.requestloop = 0; // 初始化重定向
    this.requestLink = null;
  }

  // 取消发送
  abort() {
    try {
      if (isFunction(this.requestLink.abort)) {
        this.requestLink.abort();
      }
    } catch (e) {}
  }

  // 发送
  request(apiRequest: ApiRequest) {
    return new Promise((reslove, reject) => {
      this.requestloop++;
      if (!Validator(apiRequest, REQUEST_SCHEMA).valid) {
        reject(utils.convertResult('error', '错误的JSON数据格式'));
        return;
      }
      const requestUrl = new UrlParse(apiRequest?.url);
      if (requestUrl.protocol === 'http:' && toInteger(requestUrl.port) == 0) {
        requestUrl.port = 80;
      }
      if (requestUrl.protocol === 'https:' && toInteger(requestUrl.port) == 0) {
        requestUrl.port = 443;
      }
      let uri: string = apiRequest?.url;
      try {
        //需要截取出需要encode部分，只对需要部分encode，防止重复encode
        uri = utils.encodeURI2(apiRequest?.url);
      } catch (err) {
        reject(err.message);
      }

      // 获取发送参数
      const options: any = {
        encoding: null,
        verbose: true,
        time: true,
        followRedirect: !1,
        timeout: this.options?.requester?.http?.timeout ?? 0,
        brotli: true, // 请求 Brotli 压缩内容编码
        gzip: false, // 请求 gzip 压缩内容编码
        useQuerystring: !0,
        uri: uri, // 接口请求的完整路径或者相对路径（最终发送url = baseUrl + uri）
        qs: utils.formatQueries(apiRequest?.params?.parameter), // 此项会覆盖URL中的已有值
        method: apiRequest?.method ?? 'GET', //请求方式，默认GET
        headers: {
          'User-Agent': `Apimis-Send/ ${process.env.npm_package_version} (https://www.apimis.com)`,
          ...formatHeaders(apiRequest?.headers?.parameter),
          ...createAuthHeaders(apiRequest),
        },
        agentOptions: {},
        strictSSL: false,
      };

      //请求body相关处理
      const bodyData = formatBodys(apiRequest);
      if (!isEmpty(bodyData?.error)) {
        reject(utils.convertResult('error', bodyData?.error));
        return;
      }
      if (!isEmpty(bodyData?.body)) {
        options.body = bodyData?.body;
      }
      if (!isEmpty(bodyData?.header)) {
        Object.entries(bodyData?.header).forEach(([key, value]) => {
          options.headers[key] = value;
        });
      }

      //代理相关
      const proxyConfig = formatProxys(requestUrl, apiRequest, this.options?.requester);
      if (!isNull(proxyConfig)) {
        options.proxy = proxyConfig.host + ':' + proxyConfig.port;
        if (!isUndefined(proxyConfig?.proxyAuth)) {
          options.headers['Proxy-Authorization'] = proxyConfig?.proxyAuth;
        }
      }

      //https证书
      const agentOptions = formatHttps(requestUrl, this.options?.requester);
      if (isPlainObject(agentOptions) && !isEmpty(agentOptions)) {
        options.agentOptions = agentOptions;
      }

      //认证bugfix
      if (apiRequest?.auth?.type == 'ntlm') {
        options.forever = true;
      }

      //cookie相关
      const cookies = formatCookies(apiRequest?.url, this.options?.cookies, apiRequest);
      if (!isEmpty(cookies)) {
        const cookieJar = request.jar();
        Object.entries(cookies).forEach(([name, value]) => {
          if (!isEmpty(name)) {
            const cookie = request.cookie(`${name}=${value}`);
            cookieJar.setCookie(cookie, uri);
          }
        });
        options.jar = cookieJar;
      }

      // 发送并返回响应
      this.requestLink = request(options, async (error: any, response: any, body: any) => {
        if (error) {
          reject(utils.convertResult('error', error.toString()));
          return;
        }
        let _headers: any = [];
        if (isObject(response.request.headers)) {
          for (let _key in response.request.headers) {
            _headers.push({
              key: _key,
              value: response.request.headers[_key],
            });
          }
        }

        let _request: any = {
          header: _headers,
        };

        let _request_uris: any = {};
        try {
          _request_uris = new UrlParse(options.uri);
        } catch (e) {
          _request_uris = cloneDeep(JSON5.parse(JSON5.stringify(urlNode.parse(options.uri))));
        }

        if (isObject(response.request)) {
          _request = {
            url: options.uri,
            uri: _request_uris,
            method: response.request.method,
            timeout: response.request.timeout,
            contentType: response.request.headers['content-type'] ?? 'none',
            header: _headers,
            proxy: response.request.proxy,
            request_headers: response.request.headers,
          };
        }

        //重定向超过限制
        if (
          this.options?.requester?.http?.follow_redirect !== 1 ||
          (this?.options?.requester?.http?.max_requst_loop !== 0 &&
            this.requestloop > this.options?.requester?.http.max_requst_loop)
        ) {
          const data = await utils.formatResponseData(response, body);
          utils.convertResult('success', 'success', {
            request: _request,
            response: data,
          });
          reslove(data);
          return;
        }

        if (
          response.caseless.has('location') === 'location' &&
          inRange(response.statusCode, 300, 399)
        ) {
          // 3xx  重定向
          let loopRequest: ApiRequest | any = cloneDeep(apiRequest);
          loopRequest.url = response.caseless.get('location');
          if (
            isString(_request_uris?.origin) &&
            !startsWith(toLower(loopRequest.url), 'https://') &&
            !startsWith(toLower(loopRequest.url), 'http://')
          ) {
            loopRequest.url = urlJoin(_request_uris?.origin, loopRequest.url);
          }
          this.request(loopRequest)
            .then((res) => {
              reslove(res);
            })
            .catch((e) => {
              reject(e);
            });

          return;
        }
        if (response.caseless.has('www-authenticate') === 'www-authenticate') {
          // http auth
          let loopRequest: ApiRequest = cloneDeep(apiRequest);
          try {
            let parsed = new parsers.WWW_Authenticate(response.caseless.get('www-authenticate'));
            if (parsed.scheme == 'Digest') {
              // Digest
              Object.assign(loopRequest.auth.digest, parsed.parms);
              this.request(loopRequest)
                .then((res) => {
                  reslove(res);
                })
                .catch((e) => {
                  reject(e);
                });
            } else if (loopRequest.auth.type == 'ntlm') {
              Object.assign(loopRequest.auth.ntlm, {
                type2msg: ntlm.parseType2Message(response.caseless.get('www-authenticate')),
              });
              this.request(loopRequest)
                .then((res) => {
                  reslove(res);
                })
                .catch((e) => {
                  reject(e);
                });
            } else {
              reslove(
                utils.convertResult('success', 'success', {
                  request: _request,
                  response: await utils.formatResponseData(response, body),
                })
              );
            }
          } catch (e) {
            reslove(
              utils.convertResult('success', 'success', {
                request: _request,
                response: await utils.formatResponseData(response, body),
              })
            );
          }
          return;
        }
        reslove(
          utils.convertResult('success', 'success', {
            request: _request,
            response: await utils.formatResponseData(response, body),
          })
        );
      });
    });
  }
}
