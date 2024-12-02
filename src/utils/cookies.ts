import Cookies from 'js-cookie';
import { endsWith, isDate, lt, startsWith, trim } from 'lodash';
import UrlParse from 'url-parse';
import { Cookie } from '../types/cookie';

export const getCookie = (key) => {
  return Cookies.get(key);
};

export const setCookie = (key, value, options?: any) => {
  Cookies.set(key, value, options);
};

export const removeCookie = (key, options?: any) => {
  Cookies.remove(key, options);
};

export const isValidCookie = (request_url, cookieItem: Cookie) => {
  const _uri = new UrlParse(request_url);
  //domain校验
  let cookieDomain = cookieItem?.domain;
  if (trim(cookieDomain) && !endsWith(_uri.hostname, trim(cookieDomain))) {
    return false;
  }

  // path校验
  if (
    trim(cookieItem?.path) &&
    !startsWith(endsWith(_uri.pathname, '/') ? _uri.pathname : `${_uri.pathname}/`, cookieItem.path)
  ) {
    return false;
  }

  // expire校验
  if (cookieItem.expires) {
    const expires = new Date(cookieItem.expires);
    if (isDate(expires) && String(expires) != 'Invalid Date' && lt(expires, new Date())) {
      return false;
    }
  }
  // secure 校验
  if (cookieItem?.secure && _uri.protocol != 'https:') {
    return false;
  }

  return true;
};
