// @ts-nocheck

import { isFunction, isString, isNumber, isObject, has } from 'lodash';
import ajaxToApimis from './ajax-to-apimis';
import { isJson5 } from '../utils/is';
const JSON5 = require('json5');
import ApimisSend from '../apimis-send';
import Response from '../utils/response';

async function nodeAjax(options, ...args) {
  if (isString(options)) {
    options = {
      url: options,
      method: 'GET',
      data: {} as any,
    };
  }
  if (isFunction(args?.[0])) {
    options.success = args[0];
  }
  const apiCollection = ajaxToApimis(options);
  const request = new ApimisSend({
    timeout: isNumber(options.timeout) && options.timeout >= 0 ? options.timeout : 5000,
  });
  try {
    const resp = await request.request(apiCollection);
    if (!has(resp, 'stream')) {
      options?.success('请求失败', {});
      return;
    }
    let rawBody = resp?.stream.toString();
    let ext = {
      cookies: resp?.['cookies'],
      headers: resp?.['headers'],
    };
    if (isJson5(rawBody)) {
      rawBody = JSON5.parse(rawBody);
    }
    if (isFunction(options?.success)) {
      options.success(null, new Response(resp), ext);
    }
    return new Response(resp);
  } catch (err) {
    options.success(err?.message, {});
  }
}

export default nodeAjax;
