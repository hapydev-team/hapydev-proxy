// 请求认证类型
export type HTTP_AUTH_TYPE =
  | 'inherit'
  | 'noauth'
  | 'basic'
  | 'bearer'
  | 'jwt'
  | 'digest'
  | 'oauth1'
  | 'oauth2'
  | 'hawk'
  | 'awsv4'
  | 'ntlm'
  | 'apikey'
  | 'edgegrid'
  | 'asap';

export type TYPE_AUTH_BASIC = {
  username: string;
  password: string;
};

export type TYPE_AUTH_BEARER = {
  token: string;
};

export type TYPE_AUTH_JWT = {
  payload: string;
  header: string;
  queryParamKey: string;
  secret: string;
  addTokenTo: string;
  isSecretBase64Encoded: 1 | -1;
  algorithm: string;
  headerPrefix: string;
};

export type TYPE_AUTH_DIGEST = {
  username: string;
  password: string;
  realm: string;
  nonce: string;
  algorithm: string;
  qop: string;
  nonceCount: string;
  clientNonce: string;
  opaque: string;
  disableRetryRequest: 1 | -1; // 是否禁用重新请求
};

export type TYPE_AUTH_OAUTH1 = {
  addParamsToHeader: 1 | -1;
  signatureMethod: string;
  consumerKey: string;
  consumerSecret: string;
  token: string;
  privateKey?: string;
  tokenSecret: string;
  callback: string;
  verifier: string;
  timestamp: string;
  nonce: string;
  version: string;
  realm: string;
  includeBodyHash: 1 | -1;
  addEmptyParamsToSign: 1 | -1;
  disableHeaderEncoding: 1 | -1; //Encode the parameters in the Authorization header
};

export type TYPE_AUTH_OAUTH2 = {
  addTokenTo: 'header' | 'url';
  currentToken: {
    refreshToken: string;
    accessToken: string;
    headerPrefix: string;
    tokenType: string;
    expiresIn: number; //有效时间单位：s
    timestamp: number; //签发token时间戳
  };
  grant_type: string; // 授权类型
  redirect_uri: string; //授权成功后返回地址
  authUrl: string;
  accessTokenUrl: string;
  clientId: string;
  clientSecret: string;
  username?: string;
  password?: string;
  challengeAlgorithm?: string; //Code Challenge Method
  code_verifier?: string;
  scope?: string;
  state?: string;
  client_authentication: 'header' | 'body';
  fllowAcceccTokenUrl: 1 | -1; //刷新地址token与获取token地址一致
  refreshTokenUrl: string; //刷新token url地址
};

export type TYPE_AUTH_HAWK = {
  authId: string;
  authKey: string;
  algorithm: string;
  user: string;
  nonce: string;
  extraData: string;
  app: string;
  delegation: string;
  timestamp: string;
  includePayloadHash: 1 | -1;
};

export type TYPE_AUTH_AWSV4 = {
  addAuthDataToQuery: 1 | -1;
  accessKey: string;
  secretKey: string;
  region: string;
  service: string;
  sessionToken: string;
};

export type TYPE_AUTH_NTLM = {
  disableRetryRequest: 1 | -1;
  username: string;
  password: string;
  domain: string;
  workstation: string;
};

export type TYPE_AUTH_API_KEY = {
  key: string;
  value: string;
  in: 'header' | 'query';
};

export type TYPE_AUTH_EDGEGRID = {
  accessToken: string;
  clientToken: string;
  clientSecret: string;
  nonce: string;
  timestamp: string;
  baseURi: string;
  headersToSign: string;
  maxBodySize: number;
};

export type TYPE_AUTH_ASAP = {
  alg: string;
  iss: string;
  aud: string;
  kid: string;
  privateKey: string;
  sub: string;
  claims: string;
  exp: string;
};

export type Auth = {
  type: HTTP_AUTH_TYPE;
  basic?: TYPE_AUTH_BASIC;
  jwt?: TYPE_AUTH_JWT;
  bearer?: TYPE_AUTH_BEARER;
  digest?: TYPE_AUTH_DIGEST;
  oauth1?: TYPE_AUTH_OAUTH1;
  oauth2?: TYPE_AUTH_OAUTH2;
  hawk?: TYPE_AUTH_HAWK;
  awsv4?: TYPE_AUTH_AWSV4;
  ntlm?: TYPE_AUTH_NTLM;
  apikey?: TYPE_AUTH_API_KEY;
  edgegrid?: TYPE_AUTH_EDGEGRID;
  asap?: TYPE_AUTH_ASAP;
};
