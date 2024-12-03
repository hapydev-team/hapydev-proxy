import { isUndefined } from 'lodash';
import { ApimisRunner } from 'hapydev-runtime';

const handleGrpc = (pools: { [runtime_id: string]: any }, emitter, params) => {
  const { action, runtime_id, data } = params;

  const handleSendWSData = (type, ...args) => {
    emitter.emit('grpc', type, runtime_id, ...args);
  };

  const getRunner = (runtime_id) => {
    if (!isUndefined(pools?.[runtime_id])) {
      return pools?.[runtime_id];
    }
    const grpcRunner = new ApimisRunner.GrpcRunner({
      onMethods: handleSendWSData.bind(null, 'methods'),
      onResponse: handleSendWSData.bind(null, 'response'),
      onConsole: handleSendWSData.bind(null, 'console'),
      onError: handleSendWSData.bind(null, 'error'),
      onReflectError: handleSendWSData.bind(null, 'reflect-error'),
      onAssert: handleSendWSData.bind(null, 'assert'),
      onVariables: handleSendWSData.bind(null, 'variables'),
      onMetadata: handleSendWSData.bind(null, 'metadata'),
      onMessage: handleSendWSData.bind(null, 'message'),
      onSent: handleSendWSData.bind(null, 'sent'),
      onStreamEnd: handleSendWSData.bind(null, 'stream-end'),
      onStreamStart: handleSendWSData.bind(null, 'stream-start'),
      onMockRequest: handleSendWSData.bind(null, 'mock-request-callback'),
    });
    return grpcRunner;
  };

  if (action === 'get-reflect-methods') {
    pools[runtime_id] = getRunner(runtime_id);
    pools[runtime_id].getReflectMethods(data);
    return;
  }
  if (action === 'get-proto-methods') {
    pools[runtime_id] = getRunner(runtime_id);
    pools[runtime_id].getProtoMethods(data);
    return;
  }
  if (action === 'send-request') {
    pools[runtime_id] = getRunner(runtime_id);
    const { collection, options } = data;
    pools[runtime_id].sendRequest(collection, options);
    return;
  }
  if (action === 'send-message') {
    pools[runtime_id] = getRunner(runtime_id);
    pools[runtime_id].sendMessage(data);
    return;
  }
  if (action === 'end-stream') {
    pools[runtime_id] = getRunner(runtime_id);
    pools[runtime_id].endStream();
    return;
  }
  if (action === 'mock-request') {
    pools[runtime_id] = getRunner(runtime_id);
    pools[runtime_id].mockRequestMessage(data);
    return;
  }
};

export default handleGrpc;
