// @ts-nocheck

import { isObject, isString } from 'lodash';

export const getNetWork = (client: any) => {
  const netWork = {
    agent: 'Apihex-Agent',
    localAddress: null,
    remoteAddress: null,
  };

  if (isObject(client)) {
    if (isString(client?.localAddress)) {
      netWork.localAddress = {
        ip: client.localAddress,
        port: client.localPort,
      };
    }
    if (isString(client.remoteAddress)) {
      netWork.remoteAddress = {
        ip: client.remoteAddress,
        family: client.remoteFamily,
        port: client.remotePort,
      };
    }
  }
  return netWork;
};
