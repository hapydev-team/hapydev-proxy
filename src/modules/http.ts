import { isFunction, isUndefined } from 'lodash';
import { ApimisRunner } from 'hapydev-runtime-v2';

const handleHttp = (pools: { [runtime_id: string]: any }, emitter, params) => {
  const { action, runtime_id, data } = params;

  const handleSendHttpData = (type, ...args) => {
    emitter.emit('http', type, runtime_id, ...args);
  };

  const getRunner = (runtime_id) => {
    if (!isUndefined(pools?.[runtime_id])) {
      return pools?.[runtime_id];
    }
    const httpRunner = new ApimisRunner.HttpRunner({
      onAssert: handleSendHttpData.bind(null, 'assert'),
      onConsole: handleSendHttpData.bind(null, 'console'),
      onHttpErrpr: handleSendHttpData.bind(null, 'error'),
      onResponse: handleSendHttpData.bind(null, 'response'),
      onVisualizing: handleSendHttpData.bind(null, 'visualiz'),
      onVariables: handleSendHttpData.bind(null, 'variables'),
    });
    return httpRunner;
  };

  if (action === 'request') {
    pools[runtime_id] = getRunner(runtime_id);
    try {
      const { collection, options } = data;
      if (isFunction(pools?.[runtime_id]?.stop)) {
        pools?.[runtime_id]?.stop?.();
      }
      pools[runtime_id].run(collection, options);
    } catch (err) {
      delete pools[runtime_id];
      emitter.emit('http', 'error', runtime_id, err?.message);
    }
    return;
  }
  if (action === 'stop') {
    if (isFunction(pools?.[runtime_id]?.stop)) {
      pools?.[runtime_id]?.stop?.();
    }
    delete pools[runtime_id];
    return;
  }
};

export default handleHttp;
