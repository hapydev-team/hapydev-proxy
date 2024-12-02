import { BaseCollection } from './base';
import { DataItem } from './dataItem';

export type SocketIOBody = {
  title: string;
  mode: 'text' | 'json' | 'binary';
  binary_type: 'base64' | 'hexadecimal';
  raw: string;
};

export type SocketIORequest = {
  url: string;
  headers: {
    parameter: DataItem[];
  };
  params: {
    parameter: DataItem[];
  };
  body: Omit<SocketIOBody, 'title'>;
  events: SocketIOEvent[];
};

export type SocketIOEvent = {
  is_used: 1 | -1;
  name: string;
  description: string;
};

export type WebsocketConfig = {
  enable_ssl_verify: 1 | -1;
  handshake_timeout: number;
  max_reconnect_count: number; //最大重连次数
  reconnect_interval: number;
  max_message_size: number;
};

export type SocketIOConfig = {
  enable_ssl_verify: 1 | -1;
  client_version: string;
  handshake_path: string; //握手路径
  handshake_timeout: number; //握手最大超时时间
  max_reconnect_count: number; //最大重连次数
  reconnect_interval: number; //重连间隔
  socket_event_name: string;
  is_use_ack: 1 | -1;
};

export interface SocketIOCollection extends BaseCollection {
  data: {
    request: SocketIORequest;
    description: string;
    config: SocketIOConfig;
    messages: SocketIOBody[];
    status: string; //状态
  };
}
