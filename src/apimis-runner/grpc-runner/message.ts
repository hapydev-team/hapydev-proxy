import { isArray, isMap, trim } from 'lodash';
import { GrpcRequest } from '../../types/collection/grpc';
import { runTasks } from '../runtasks';
const grpc = require('@grpc/grpc-js');
import dayjs from 'dayjs';
import { ApiOptions } from '../../types/options';

export const parseMessage = (text) => {
  try {
    return JSON.parse(text);
  } catch (ex) {
    return text;
  }
};

const getMetadata = (request: GrpcRequest) => {
  const requestMetadata = new grpc.Metadata();
  request.meta_data.forEach((item) => {
    if (item.is_used === 1 && trim(item?.name) !== '') {
      requestMetadata.set(item?.name, item?.value);
    }
  });
  return requestMetadata;
};

function grpcConnection(mode, client, request: GrpcRequest, grpcResponse) {
  const requestMetadata = getMetadata(request);

  const messageText = this.mySandbox.replaceVariables(request?.message, null, -1);
  const requestJson = parseMessage(messageText);

  //一元调用
  if (mode === 'unaryCall') {
    return client?.[request?.method_name](requestJson, requestMetadata, (error, data) => {
      if (error) {
        this.onError(error.message);
        return;
      }
      grpcResponse.messages = [
        {
          data,
          timestamp: dayjs().format(),
        },
      ];
      this.onMessage(data);
    });
  }
  //服务端流式调用
  if (mode === 'serverStreaming') {
    this.onSent(requestJson);
    return client?.[request?.method_name](requestJson, requestMetadata);
  }
  //客户端流式调用
  if (mode === 'clientStreaming') {
    return client?.[request?.method_name](requestMetadata, (error, data) => {
      if (error) {
        this.onError(error.message);
        return;
      }
      grpcResponse.messages = [
        {
          data,
          timestamp: dayjs().format(),
        },
      ];

      this.onMessage(data);
      // this.onStreamEnd('客户端已断开');
    });
  }
  //双向元数据调用
  if (mode === 'bidirectional') {
    return client?.[request?.method_name](requestMetadata);
  }
}

export async function executeRequest(mode, client, request: GrpcRequest, options: ApiOptions) {
  const timeStart = performance.now();
  const grpcResponse = {
    statusCode: 0,
    responseTime: 0,
    metadata: [],
    trailer: [],
    messages: [],
  };
  const call = grpcConnection.apply(this, [mode, client, request, grpcResponse]);
  call.on('data', (data) => {
    this.onMessage(data);
    grpcResponse.messages.push({
      data,
      timestamp: dayjs().format(),
    });
  });
  call.on('status', async (data) => {
    grpcResponse.responseTime = performance.now() - timeStart;
    grpcResponse.statusCode = data?.code;
    if (isMap(data?.metadata?.internalRepr)) {
      for (const [key, value] of data?.metadata?.internalRepr) {
        grpcResponse.trailer.push({
          key,
          value: value?.[0],
        });
      }
    }
    this.mySandbox.postman.setGrpcResult(grpcResponse);
    this.onResponse(grpcResponse);
    //执行后执行脚本
    if (isArray(request?.post_tasks)) {
      await runTasks(request?.post_tasks, {
        sandbox: this.mySandbox,
      });
    }

    this.onVariables({
      project_id: options?.project_id,
      env_id: options?.env_id,
      variables: options?.variables,
    });
  });

  call.on('metadata', (metadata) => {
    const result = [];
    if (isMap(metadata?.internalRepr)) {
      for (const [key, value] of metadata?.internalRepr) {
        result.push({
          key,
          value: value?.[0],
        });
      }
    }
    grpcResponse.metadata = result;
    this.onMetadata(result);
  });
  // call.on('end', (status) => {
  //   this.onStreamEnd('客户端已断开end');
  // });
  call.on('close', (status) => {
    this.onStreamEnd('客户端已断开close');
    //  this.onStreamEnd('客户端已断开');
  });
  call.on('error', (error) => {
    this.onError(error.message);
    this.onStreamEnd('客户端已断开err');
  });

  return call;
}

//服务端流式调用
// export function serverStreamingWithMetadata(client, request: GrpcRequest) {
//   return new Promise((resolve, reject) => {
//     const requestJson = parseMessage(request?.message);
//     const requestMetadata = getMetadata(request);
//     const call = client?.[request?.method_name](requestJson, requestMetadata);
//     call.on('metadata', (metadata) => {
//       const result = Object.fromEntries(metadata?.internalRepr);
//       this.onMetadata(result);
//     });
//     call.on('data', (value) => {
//       this.onMessage(value);
//     });
//     call.on('end', (status) => {
//       this.onStreamEnd();
//     });
//     call.on('error', (error) => {
//       this.onError(error.message);
//     });
//   });
// }

//客户端流式调用
// export function clientStreamingWithMetadata(client, request: GrpcRequest) {
//   return new Promise((resolve, reject) => {
//     const requestMetadata = getMetadata(request);
//     const call = client?.[request?.method_name](requestMetadata, (error, value) => {
//       if (error) {
//         reject(error);
//         return;
//       }
//       this.onMessage(value);
//     });
//     call.on('metadata', (metadata) => {
//       const result = Object.fromEntries(metadata?.internalRepr);
//       this.onMetadata(result);
//     });
//     call.on('status', (data) => {
//       console.log(data, '==status===');
//     });
//     call.on('data', (data) => {
//       this.onMessage(data);
//     });

//     this.onStreamStart(); //通知客户端开始流模式
//     resolve(call);
//   });
// }

//双向元数据调用
// export function bidirectionalWithMetadata(client, request: GrpcRequest) {
//   return new Promise((resolve, reject) => {
//     const requestMetadata = getMetadata(request);
//     const call = client?.[request?.method_name](requestMetadata);
//     call.on('metadata', (metadata) => {
//       const result = Object.fromEntries(metadata?.internalRepr);
//       this.onMetadata(result);
//     });
//     call.on('data', (value) => {
//       this.onMessage(value);
//     });
//     call.on('status', (data) => {
//       console.log(data, '==status===');
//     });
//     call.on('error', (error) => {
//       this.onStreamEnd('客户端已断开');
//     });
//     this.onStreamStart(); //通知客户端开始流模式
//     resolve(call);
//   });
// }
