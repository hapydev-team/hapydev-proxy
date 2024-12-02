import { isArray, isPlainObject, isString } from 'lodash';
import { DataItem } from '../../types/collection';

export const postmanRequest = (request, options?: any) => {
  const { setRequestHeader, removeRequestHeader } = options;

  const _request = { url: request?.url, method: request?.method, body: request?.body, headers: [] };
  const items = [];
  Object.defineProperty(_request, 'headers', {
    get: () => {
      items.length = 0;
      if (isArray(request?.headers?.parameter)) {
        request?.headers?.parameter?.forEach((item: DataItem) => {
          if (item.is_used === 1) {
            items.push({ name: item.name, value: item.value });
          }
        });
      }
      return items || [];
    },
  });
  ['add', 'upsert'].forEach((method) => {
    Object.defineProperty(_request.headers, method, {
      configurable: true,
      value(...args) {
        if (args.length === 1 && isPlainObject(args[0])) {
          const { key, value } = args[0];
          if (isString(key)) {
            setRequestHeader(key, value);
          }
          return;
        }
        if (args.length >= 2) {
          setRequestHeader(args[0], args[1]);
        }
      },
    });
  });

  Object.defineProperty(_request.headers, 'remove', {
    configurable: true,
    value(key) {
      return removeRequestHeader(key);
    },
  });

  return _request;
};
