const Base64 = require('js-base64');
const { trim } = require('lodash');
const Hawk = require('hawk');
const aws4 = require('aws4');
const EdgeGridAuth = require('akamai-edgegrid/src/auth');
const ntlm = require('httpntlm').ntlm;
import { formatQueries, setQueryString } from '../utils/querystring';
import { formatRequestBodys } from '../utils/formatsBodys';
import getOAuth1Header from './getOAuth1Header';
import getDigestHeader from './getDigestHeader';
import { ApiRequest } from '../../types/collection';

// 根据 auth 类型生成auth header参数
const createAuthHeaders = (apihexRequest: ApiRequest) => {
  let headers: any = {};
  let auth = apihexRequest?.auth;
  let { uri, host, fullPath, baseUri } = setQueryString(
    apihexRequest?.url,
    formatQueries(apihexRequest?.params.parameter)
  );
  let entityBody = '';
  let rbody = formatRequestBodys(apihexRequest);

  if (apihexRequest?.body.mode == 'urlencoded') {
    entityBody = rbody['form'];
  } else if (apihexRequest?.body.mode != 'form-data') {
    entityBody = rbody['body'];
  }
  try {
    switch (auth.type) {
      case 'noauth':
        break;
      case 'apikey':
        if (trim(auth.apikey.key) != '') {
          headers[trim(auth.apikey.key)] = auth.apikey.value;
        }
        break;
      case 'bearer':
        if (trim(auth.bearer.token) != '') {
          headers['Authorization'] = 'Bearer ' + trim(auth.bearer.token);
        }
        break;
      case 'basic':
        headers['Authorization'] =
          'Basic ' + Base64.encode(auth.basic.username + ':' + auth.basic.password);
        break;
      case 'digest':
        headers['Authorization'] = getDigestHeader(auth, apihexRequest, fullPath, entityBody);
        break;
      case 'hawk':
        let options = {
          ext: auth.hawk.extraData,
          timestamp: auth.hawk.timestamp,
          nonce: auth.hawk.nonce,
          app: auth.hawk.app,
          dlg: auth.hawk.delegation,
        };

        if (auth.hawk.algorithm === '') {
          auth.hawk.algorithm = 'sha256';
        }

        if (auth.hawk.authId !== '' && auth.hawk.authKey !== '') {
          let { header } = Hawk.client.header(uri, apihexRequest.method, {
            credentials: {
              id: auth.hawk.authId,
              key: auth.hawk.authKey,
              algorithm: auth.hawk.algorithm,
            },
            ...options,
          });
          headers['Authorization'] = header;
        }
        break;
      case 'awsv4':
        let awsauth = aws4.sign(
          {
            method: apihexRequest.method,
            host: host,
            path: fullPath,
            service: auth.awsv4.service,
            region: auth.awsv4.region,
            body: entityBody,
          },
          {
            accessKeyId: auth.awsv4.accessKey,
            secretAccessKey: auth.awsv4.secretKey,
            sessionToken: auth.awsv4.sessionToken,
          }
        );

        Object.assign(headers, awsauth.headers);
        break;
      case 'edgegrid':
        let eg = EdgeGridAuth.generateAuth(
          {
            path: uri,
            method: apihexRequest.method,
            headers: {},
            body: entityBody,
          },
          auth.edgegrid.clientToken,
          auth.edgegrid.clientSecret,
          auth.edgegrid.accessToken,
          auth.edgegrid.baseURi,
          0,
          auth.edgegrid.nonce,
          auth.edgegrid.timestamp
        );

        Object.assign(headers, eg.headers);
        break;
      case 'ntlm':
        Object.assign(headers, {
          Connection: 'keep-alive',
          Authorization: ntlm.createType1Message({
            url: uri,
            username: auth.ntlm.username,
            password: auth.ntlm.password,
            workstation: auth.ntlm.workstation,
            domain: auth.ntlm.domain,
          }),
        });
        break;

      case 'ntlm_close':
        Object.assign(headers, {
          Connection: 'close',
          Authorization: ntlm.createType3Message(auth.ntlm_close.type2msg, {
            url: uri,
            username: auth.ntlm.username,
            password: auth.ntlm.password,
            workstation: auth.ntlm.workstation,
            domain: auth.ntlm.domain,
          }),
        });
        break;
      case 'oauth1':
        Object.assign(headers, getOAuth1Header(auth, uri, apihexRequest, entityBody));
        break;
    }
  } catch (e) {}

  return headers;
};

export default createAuthHeaders;
