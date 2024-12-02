import { BaseCollection } from './base';
import { DataItem } from './dataItem';

export type WebsocketBody = {
  title: string;
  mode: 'text' | 'json' | 'xml' | 'html' | 'binary';
  binary_type: 'base64' | 'hexadecimal';
  raw: string;
};

export type WebsocketRequest = {
  url: string;
  headers: {
    parameter: DataItem[];
  };
  params: {
    parameter: DataItem[];
  };
  body: Omit<WebsocketBody, 'title'>;
};

export type WebsocketConfig = {
  enable_ssl_verify: 1 | -1;
  handshake_timeout: number;
  max_reconnect_count: number; //最大重连次数
  reconnect_interval: number;
  max_message_size: number;
};

export interface WebsocketCollection extends BaseCollection {
  data: {
    request: WebsocketRequest;
    description: string;
    config: WebsocketConfig;
    messages: WebsocketBody[];
    status: string; //状态
  };
}
