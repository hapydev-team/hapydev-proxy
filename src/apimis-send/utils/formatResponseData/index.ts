const { isString, isArray } = require('lodash');
const setCookie = require('set-cookie-parser');
const { getObjFromRawHeaders } = require('rawheaders2obj');

import { getNetWork } from './network';
import { getmimeType } from './mimeType';
import { getFileName } from './filename';

// 响应时间点
const responseAt = () => {
  var time: any = new Date();
  var h: any = time.getHours();
  h = h < 10 ? '0' + h : h;
  var m: any = time.getMinutes();
  m = m < 10 ? '0' + m : m;
  var s: any = time.getSeconds();
  s = s < 10 ? '0' + s : s;
  return h + ':' + m + ':' + s;
};

// 处理 响应参数
const formatResponseData = async (response: any, body: any) => {
  let netWork = getNetWork(response.client);

  let res = {
    contentSize: 0, // 响应体大小（KB）
    responseAt: responseAt(), // 响应时间
    mime: {}, // 响应类型
    netWork: netWork, //网络相关信息
    elapsedTime: null, //总耗时
    statusCode: 200, // 状态码
    statusMessage: 'OK', // 错误提示信息
    timingPhases: {}, // 响应时间详情 （ms）
    headers: {}, // 响应头
    cookies: [], //响应Cookies
    stream: Array.from(body),
    filename: null,
  };

  res.timingPhases = response.timingPhases;
  res.elapsedTime = response.elapsedTime;
  res.statusCode = response.statusCode;
  res.statusMessage = response.statusMessage;
  res.mime = await getmimeType(body, response.headers);

  // 响应headers，cookies，响应大小
  try {
    const responseHeaders = getObjFromRawHeaders(response.rawHeaders);
    if (!responseHeaders) {
      return res;
    }
    res.headers = responseHeaders;

    let lowerHeaders: any = {};
    for (let k in responseHeaders) {
      if (isString(k)) {
        lowerHeaders[k.toLowerCase()] = responseHeaders[k];
      }
    }
    if (isArray(lowerHeaders['set-cookie'])) {
      res.cookies = setCookie.parse(lowerHeaders['set-cookie']);
    }
    if (lowerHeaders.hasOwnProperty('content-length')) {
      res.contentSize = parseFloat((lowerHeaders['content-length'] / 1024).toFixed(2));
    } else {
      res.contentSize = parseFloat((body.toString().length / 1024).toFixed(2));
    }

    res.filename = getFileName(lowerHeaders, res.mime);
  } catch (ex) {}

  return res;
};

export default formatResponseData;
