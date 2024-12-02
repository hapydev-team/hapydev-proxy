import { ApiRequest, ApimisCollection } from './collection';
import { ApiCollection } from './collection/api';
import { ApiOptions } from './options';

type Callbacks = {
  //发送请求后立即回调方法
  request?: (statusCode: 'success' | 'error', message: string, data: any) => void;

  //请求结果回调方法
  response?: (statusCode: string, message: string, data: any) => void;

  //运行脚本回调结果
  assert?: (statusCode: string, message: string, data: any) => void;
  //在预执行，后执行，及全局脚本中调用
  console?: (logs: string) => void;

  //运行完成后调用
  done?: (statusCode: string, message: string) => void;
};

export type RunnerRun = (
  collection: ApiCollection,
  options: ApiOptions
  //callbacks: Callbacks
) => void;
