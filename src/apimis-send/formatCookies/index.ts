import { isArray, isEmpty } from 'lodash';
import { ApiRequest } from '../../types/collection';
import { Cookie } from '../../types/cookie';
import { isValidCookie } from '../../utils/cookies';

const formatCookies = (request_url: string, cookies: Cookie[], apiRequest: ApiRequest) => {
  const cookieDatas = {};

  if (isArray(cookies)) {
    cookies.forEach((item) => {
      if (isValidCookie(request_url, item) && !isEmpty(item?.name)) {
        cookieDatas[item?.name] = item?.value;
      }
    });
  }
  if (isArray(apiRequest?.cookies)) {
    apiRequest?.cookies.forEach((item) => {
      if (!isEmpty(item?.name)) {
        cookieDatas[item.name] = item?.value;
      }
    });
  }
  return cookieDatas;
};

export default formatCookies;
