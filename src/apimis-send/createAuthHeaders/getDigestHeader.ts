import { ApiRequest } from '../../types/collection';

const CryptoJS = require('crypto-js');

const getDigestHeader = (auth, apihexRequest: ApiRequest, fullPath, entityBody) => {
  let ha1 = '';
  let ha2 = '';
  let response = '';
  let hashFunc = CryptoJS.MD5;

  if (auth.digest.algorithm == 'MD5' || auth.digest.algorithm == 'MD5-sess') {
    hashFunc = CryptoJS.MD5;
  } else if (auth.digest.algorithm == 'SHA-256' || auth.digest.algorithm == 'SHA-256-sess') {
    hashFunc = CryptoJS.SHA256;
  } else if (auth.digest.algorithm == 'SHA-512' || auth.digest.algorithm == 'SHA-512-sess') {
    hashFunc = CryptoJS.SHA512;
  }

  let cnonce = auth.digest.cnonce == '' ? 'apihex' : auth.digest.cnonce;

  if (auth.digest.algorithm.substr(-5) == '-sess') {
    ha1 = hashFunc(
      hashFunc(
        auth.digest.username + ':' + auth.digest.realm + ':' + auth.digest.password
      ).toString() +
        ':' +
        auth.digest.nonce +
        ':' +
        cnonce
    ).toString();
  } else {
    ha1 = hashFunc(
      auth.digest.username + ':' + auth.digest.realm + ':' + auth.digest.password
    ).toString();
  }

  if (auth.digest.qop != 'auth-int') {
    ha2 = hashFunc(apihexRequest?.method + ':' + fullPath).toString();
  } else if (auth.digest.qop == 'auth-int') {
    ha2 = hashFunc(
      apihexRequest?.method + ':' + fullPath + ':' + hashFunc(entityBody).toString()
    ).toString();
  }

  if (auth.digest.qop == 'auth' || auth.digest.qop == 'auth-int') {
    response = hashFunc(
      ha1 +
        ':' +
        auth.digest.nonce +
        ':' +
        (auth.digest.nc || '00000001') +
        ':' +
        cnonce +
        ':' +
        auth.digest.qop +
        ':' +
        ha2
    ).toString();
  } else {
    response = hashFunc(ha1 + ':' + auth.digest.nonce + ':' + ha2).toString();
  }

  const result =
    'Digest username="' +
    auth.digest.username +
    '", realm="' +
    auth.digest.realm +
    '", nonce="' +
    auth.digest.nonce +
    '", uri="' +
    fullPath +
    '", algorithm="' +
    auth.digest.algorithm +
    '", qop=' +
    auth.digest.qop +
    ',nc=' +
    (auth.digest.nc || '00000001') +
    ', cnonce="' +
    cnonce +
    '", response="' +
    response +
    '", opaque="' +
    auth.digest.opaque +
    '"';

  return result;
};

export default getDigestHeader;
