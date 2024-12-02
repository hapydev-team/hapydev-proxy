export const PACKAGE_CONFIG = {
  version: '0.0.30',
};

export default { PACKAGE_CONFIG };

// https证书相关
export const DEFAULT_HTTPS_OPTIONS = {
  rejectUnauthorized: -1, // 忽略错误证书 1 -1
  certificateAuthority: '', // ca证书地址
  certificate: '', // 客户端证书地址
  key: '', //客户端证书私钥文件地址
  pfx: '', // pfx 证书地址
  passphrase: '', // 私钥密码
};
