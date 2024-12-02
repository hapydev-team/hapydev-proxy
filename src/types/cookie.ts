export type Cookie = {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  expires?: string;
  maxAge?: number;
  secure?: true;
  httpOnly?: true;
  sameSite?: string;
};
