import { isUndefined } from 'lodash';
import TestingRunner from '../../src/apimis-runner/testing-Runner';
import { ApimisRunner } from '../../src';

const handleTesting = (pools: { [runtime_id: string]: TestingRunner }, emitter, params) => {
  const { action, runtime_id, data } = params;
  const handleSendData = (type, ...args) => {
    emitter.emit('testing', type, runtime_id, ...args);
  };

  const getRunner = (runtime_id) => {
    if (!isUndefined(pools?.[runtime_id])) {
      return pools?.[runtime_id];
    }
    const grpcRunner = new ApimisRunner.TestingRunner({
      onStart: handleSendData.bind(null, 'start'),
      onCancel: handleSendData.bind(null, 'cancel'),
      onComplete: handleSendData.bind(null, 'complete'),
      onConsole: handleSendData.bind(null, 'console'),
      onError: handleSendData.bind(null, 'error'),
      onRunning: handleSendData.bind(null, 'running'),
      onDone: handleSendData.bind(null, 'done'),
      onProgress: handleSendData.bind(null, 'progress'),
    });
    return grpcRunner;
  };

  if (action === 'execute') {
    pools[runtime_id] = getRunner(runtime_id);
    pools[runtime_id].execute(runtime_id, data.testing, data.options);
    return;
  }
};

export default handleTesting;
