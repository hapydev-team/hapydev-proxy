export const getSocketIO = (version) => {
  if (version === 'v2') {
    const result = require('socket.io-client2');
    return result;
  }
  if (version === 'v3') {
    const { io } = require('socket.io-client3');
    return io;
  }
  if (version === 'v4') {
    const { io } = require('socket.io-client4');
    return io;
  }
};
