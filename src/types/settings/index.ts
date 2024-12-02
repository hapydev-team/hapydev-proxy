export type CertFileInfo = {
  path: string; //本地路径
  base64: string; //base64地址
  file_name: string; //文件名
};
export type ClientCertInfo = {
  host: string; //域名
  port: number; //端口号
  password: string; //密码
  crt: CertFileInfo;
  key: CertFileInfo;
  pfx: CertFileInfo;
};
