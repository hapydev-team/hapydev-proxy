const uuid = require('uuid');
import { forEach, isObject, isPlainObject, isString, set } from 'lodash';
import { ApiRequest, DataItem } from '../types/collection';
import { isHtml, isJson5, isXml } from '../utils/is';

type AjaxToApimis = (ajaxParams: any) => ApiRequest;

const getBody = (ajaxParams) => {
  //form-data
  if (isObject(ajaxParams?.data) && ajaxParams?.data instanceof FormData) {
    const parameter = [];
    for (const [name, value] of ajaxParams.data.entries()) {
      parameter.push({
        is_used: 1,
        name,
        value,
      });
    }
    return {
      mode: 'form-data',
      parameter: parameter,
      raw: '',
    };
  }

  // urlencoded
  if (isPlainObject(ajaxParams?.data)) {
    const parameter = [];
    forEach(ajaxParams.data, (value, name) => {
      parameter.push({
        is_used: 1,
        name,
        value,
      });
    });
    return {
      mode: 'urlencoded',
      parameter: parameter,
      raw: '',
    };
  }
  //raw
  if (isString(ajaxParams?.data)) {
    const body = { mode: 'raw', parameter: [], raw: ajaxParams.data };
    if (isJson5(ajaxParams?.data)) {
      set(body, 'raw_type', 'json');
    } else if (isXml(ajaxParams.data)) {
      set(body, 'raw_type', 'xml');
    } else if (isHtml(ajaxParams.data)) {
      set(body, 'raw_type', 'html');
    } else {
      try {
        new Function(`${ajaxParams.data}`)();
        //  eval(ajaxParams.data);
        set(body, 'raw_type', 'javascript');
      } catch (e) {
        set(body, 'raw_type', 'text');
      }
    }
    return body;
  }
  return {
    mode: 'none',
    parameter: [],
    raw: '',
  };
};

const ajaxToApimis: AjaxToApimis = (ajaxParams) => {
  const method = ajaxParams?.type || ajaxParams?.method || 'get';

  const headers: DataItem[] = [];
  if (isString(ajaxParams?.contentType)) {
    headers.push({
      is_used: 1,
      name: 'content-type',
      value: ajaxParams.contentType,
    });
  }
  if (isPlainObject(ajaxParams.headers)) {
    forEach(ajaxParams.headers, (value, key) => {
      headers.push({
        is_used: 1,
        name: key,
        value,
      });
    });
  }

  const result = {
    url: ajaxParams.url,
    method,
    headers: {
      parameter: headers,
    },
    params: {
      parameter: [],
    },
    auth: {
      type: 'noauth',
    },
    body: getBody(ajaxParams),
  } as ApiRequest;

  return result;
};

export default ajaxToApimis;
