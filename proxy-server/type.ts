import {
  WebSocketRunner,
  SocketIORunner,
  HttpRunner,
  GrpcRunner,
  TestingRunner,
} from '../src/apimis-runner';

export type HttpPool = { [runtime_id: string]: HttpRunner };
export type WSPool = { [runtime_id: string]: WebSocketRunner };
export type SocketIOPool = { [runtime_id: string]: SocketIORunner };
export type GrpcPool = { [runtime_id: string]: GrpcRunner };
export type TestingPool = { [runtime_id: string]: TestingRunner };
