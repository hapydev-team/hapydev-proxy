import { ApimisRunner } from 'hapydev-runtime-v2';

const { WebSocketRunner, SocketIORunner, HttpRunner, GrpcRunner, TestingRunner } = ApimisRunner;

export type HttpPool = { [runtime_id: string]: typeof HttpRunner };
export type WSPool = { [runtime_id: string]: typeof WebSocketRunner };
export type SocketIOPool = { [runtime_id: string]: typeof SocketIORunner };
export type GrpcPool = { [runtime_id: string]: typeof GrpcRunner };
export type TestingPool = { [runtime_id: string]: typeof TestingRunner };
