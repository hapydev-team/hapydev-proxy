import ApimisSandbox from '../../apimis-sandbox';
import { GrpcCollection } from '../../types/collection/grpc';
import { getMethodDetail, getMethodsByProto, getMethodsByReflection } from './methods';
import { getClient } from './clients';

import {
  OnAssert,
  OnConsole,
  OnError,
  OnMessage,
  OnMetadata,
  OnMethods,
  OnMockRequest,
  OnReflectError,
  OnResponse,
  OnSent,
  OnStreamEnd,
  OnStreamStart,
  OnVariables,
} from './type';
import { isArray, isUndefined } from 'lodash';
import { executeRequest, parseMessage } from './message';
import { mockRequest } from './mock';
import { DEFAULT_OPTIONS } from '../constants';
import { runTasks } from '../runtasks';

type Options = {
  onMethods: OnMethods;
  onResponse: OnResponse;
  onConsole: OnConsole;
  onError: OnError;
  onReflectError: OnReflectError;
  onVariables: OnVariables;
  onAssert: OnAssert;
  onMetadata: OnMetadata;
  onMessage: OnMessage;
  onSent: OnSent;
  onStreamEnd: OnStreamEnd;
  onStreamStart: OnStreamStart;
  onMockRequest: OnMockRequest;
};

class GrpcRunner {
  onMethods: OnMethods;
  onResponse: OnResponse;
  onError: OnError;
  onReflectError: OnReflectError;
  onVariables: OnVariables;
  onMetadata: OnMetadata;
  onMessage: OnMessage;
  onSent: OnSent;
  onStreamEnd: OnStreamEnd;
  onStreamStart: OnStreamStart;
  onMockRequest: OnMockRequest;
  mySandbox: ApimisSandbox;
  myClientRequest: any;
  constructor(options: Options) {
    this.onMethods = options.onMethods;
    this.onResponse = options.onResponse;
    this.onError = options.onError;
    this.onReflectError = options.onReflectError;
    this.onVariables = options.onVariables;
    this.onMetadata = options.onMetadata;
    this.onMessage = options.onMessage;
    this.onSent = options?.onSent;
    this.onStreamEnd = options.onStreamEnd;
    this.onStreamStart = options.onStreamStart;
    this.onMockRequest = options.onMockRequest;
    this.mySandbox = new ApimisSandbox({
      onAssert: options.onAssert,
      onConsole: options.onConsole,
    });
  }

  //通过反射获取方法列表
  async getReflectMethods(data: GrpcCollection) {
    try {
      const serviceDatas = await getMethodsByReflection(data);
      this.onMethods(serviceDatas);
    } catch (err) {
      this.onReflectError(err.message);
    }
  }

  //通过proto文件获取方法列表
  async getProtoMethods(data: GrpcCollection) {
    try {
      const serviceDatas = await getMethodsByProto(data);
      this.onMethods(serviceDatas);
    } catch (err) {
      this.onError(err.message);
    }
  }
  //发送请求
  async sendRequest(collection: GrpcCollection, options = DEFAULT_OPTIONS) {
    try {
      const request = collection?.data?.request;

      //沙盒内参数初始化
      this.mySandbox.initSandbox({
        variables: options?.variables,
      });

      const client = await getClient(collection);
      if (isUndefined(client?.[request?.method_name])) {
        this.onError('方法未定义');
      }

      //1.执行预执行脚本
      if (isArray(request?.pre_tasks)) {
        await runTasks(request?.pre_tasks, {
          sandbox: this.mySandbox,
        });
      }

      const methodDetail = getMethodDetail(request, request?.service_name, request.method_name);
      if (methodDetail.request_stream === -1 && methodDetail.response_stream === -1) {
        await executeRequest.call(this, 'unaryCall', client, request, options);
      }
      if (methodDetail.request_stream === -1 && methodDetail.response_stream === 1) {
        await executeRequest.call(this, 'serverStreaming', client, request, options);
      }
      if (methodDetail.request_stream === 1 && methodDetail.response_stream === -1) {
        this.myClientRequest = await executeRequest.call(
          this,
          'clientStreaming',
          client,
          request,
          options
        );
        this.onStreamStart(); //通知客户端开始流模式
      }
      if (methodDetail.request_stream === 1 && methodDetail.response_stream === 1) {
        this.myClientRequest = await executeRequest.call(
          this,
          'bidirectional',
          client,
          request,
          options
        );
        this.onStreamStart(); //通知客户端开始流模式
      }
    } catch (err) {
      this.onError(err.message);
    }
  }

  //发送消息
  async sendMessage(message: string) {
    if (isUndefined(this.myClientRequest)) {
      this.onError('客户端已关闭');
      this.onStreamEnd('客户端已关闭');
    }
    const messageText = this.mySandbox.replaceVariables(message, null, -1);
    const requestJson = parseMessage(messageText);
    this.myClientRequest.write(requestJson);
    this.onSent(requestJson);
  }

  //结束客户端流模式
  async endStream() {
    try {
      this.myClientRequest.end();
    } catch (ex) {
      this.onError('客户端已关闭');
    }
  }

  //生成模拟请求数据
  async mockRequestMessage(collection: GrpcCollection) {
    try {
      const message = await mockRequest(collection);
      this.onMockRequest(message);
    } catch (err) {
      this.onError(err.message);
    }
  }
}

export default GrpcRunner;
