import { isUndefined } from 'lodash';
import { ApimisRunner } from 'hapydev-runtime-v2';
import dayjs from 'dayjs';

const handleWebsocket = (pools: { [runtime_id: string]: any }, emitter, params) => {
  const { action, runtime_id, data } = params;

  const handleSendWSData = (type, ...args) => {
    // console.log(type, runtime_id, args);
    emitter.emit('socket_io', type, runtime_id, ...args, dayjs().format('YYYY-MM-DD HH:mm:ss'));
  };

  const getRunner = (runtime_id) => {
    if (!isUndefined(pools?.[runtime_id])) {
      return pools?.[runtime_id];
    }
    const socketIORunner = new ApimisRunner.SocketIORunner({
      onConnOpen: handleSendWSData.bind(null, 'conn-open'),
      onConnError: handleSendWSData.bind(null, 'error'),
      onConnClose: handleSendWSData.bind(null, 'conn-close'),
      onConsole: handleSendWSData.bind(null, 'console'),
      onMessage: handleSendWSData.bind(null, 'message'),
      onSent: handleSendWSData.bind(null, 'sent'),
    });
    return socketIORunner;
  };

  if (action === 'start-connection') {
    pools[runtime_id] = getRunner(runtime_id);
    pools[runtime_id].startConnection(data.collection, data.options);
    return;
  }
  //关闭链接
  if (action === 'close-connection') {
    pools?.[runtime_id]?.closeConnection();
    return;
  }
  //取消链接
  if (action === 'cancel-connection') {
    pools?.[runtime_id]?.cancelConnection();
    return;
  }

  //发送消息
  if (action === 'send-message') {
    if (isUndefined(pools?.[runtime_id])) {
      return;
    }
    pools?.[runtime_id].sendMessage(data.event, data.message);
    return;
  }
};

export default handleWebsocket;
