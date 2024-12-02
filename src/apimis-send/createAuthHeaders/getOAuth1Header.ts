import { ApiRequest } from '../../types/collection';

const OAuth = require('oauth-1.0a');
const crypto2 = require('crypto');

const getOAuth1Header = (auth, uri, apihexRequest: ApiRequest, entityBody) => {
  let hmac = 'sha1';

  if (auth.oauth1.signatureMethod === 'HMAC-SHA1') {
    hmac = 'sha1';
  } else if (auth.oauth1.signatureMethod === 'HMAC-SHA256') {
    hmac = 'sha256';
  } else if (auth.oauth1.signatureMethod === 'HMAC-SHA512') {
    hmac = 'sha512';
  } else {
    // todo..
    // 支持更多加密方式
  }
  const oauth = OAuth({
    consumer: {
      key: auth.oauth1.consumerKey,
      secret: auth.oauth1.consumerSecret,
      version: auth.oauth1.version ?? '1.0',
      nonce: auth.oauth1.nonce,
      realm: auth.oauth1.realm,
      timestamp: auth.oauth1.timestamp,
      includeBodyHash: auth.oauth1.includeBodyHash,
    },
    signature_method: auth.oauth1.signatureMethod,
    hash_function(base_string: string, key: string) {
      let hash = crypto2.createHmac(hmac, key).update(base_string).digest('base64');
      return hash;
    },
  });

  const request_data = {
    url: uri,
    method: apihexRequest.method,
    data: auth.oauth1.includeBodyHash ? entityBody : {},
    oauth_callback: auth.oauth1.callback,
  };
  const token = {
    key: auth.oauth1.token,
    secret: auth.oauth1.tokenSecret,
  };
  return oauth.toHeader(oauth.authorize(request_data, token));
};

export default getOAuth1Header;
