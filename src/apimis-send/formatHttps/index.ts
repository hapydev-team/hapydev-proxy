import { isArray, isEmpty, isNumber, isObject, isPlainObject, isString, isUndefined } from 'lodash';
import { Requester } from '../../types/options';
const fs = require('fs');
import { Base64 } from 'js-base64';

const formatHttps = (requestUrl: any, runtimeRequester: Requester) => {
  const https: any = {};

  // ca 证书相关
  if (isNumber(runtimeRequester?.ca_cert?.is_used) && runtimeRequester?.ca_cert?.is_used > 0) {
    let cacert_path = runtimeRequester?.ca_cert?.path;
    let cacert_base64 = `${runtimeRequester?.ca_cert?.base64}`.replace(/^data:.*?;base64,/, '');

    if (fs.existsSync(cacert_path)) {
      try {
        https.ca = fs.readFileSync(cacert_path);
      } catch (e) {}
    } else if (isUndefined(https.ca)) {
      https.ca = Buffer.from(cacert_base64, 'base64');
    }
  }

  if (!isArray(runtimeRequester?.client_certs)) {
    return https;
  }
  // 客户端证书
  const clientCert = runtimeRequester?.client_certs.find((item) => {
    return requestUrl.hostname == item.host && requestUrl.port == item.port;
  });

  if (isObject(clientCert) && !isEmpty(clientCert)) {
    const CERT_DATAS = { key: 'key', pfx: 'pfx', certificate: 'crt' };
    Object.entries(CERT_DATAS).forEach(([key, value]) => {
      let _path: string = clientCert?.[value].path;
      let _base64: string = clientCert?.[value]?.base64.replace(/^data:.*?;base64,/, '');
      if (fs.existsSync(_path)) {
        https[key] = fs.readFileSync(_path);
      } else if (Base64.isValid(_base64)) {
        https[key] = Buffer.from(_base64, 'base64');
      }
    });

    if (isString(clientCert?.password) && !isEmpty(clientCert?.password)) {
      https.passphrase = clientCert?.password;
    }
  }

  return https;
};

export default formatHttps;
