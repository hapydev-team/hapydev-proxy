const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const http = require('http');
import { clearUsedPort, DEFAULT_PORT } from './ports';
import { RUNTIME_EMMITS } from './constants';
import { HttpPool, WSPool, SocketIOPool, GrpcPool, TestingPool } from './type';
const EventEmitter = require('events');
import { cloneDeep } from 'lodash';
import handleHttp from './modules/http';
import handleWebsocket from './modules/websocket';
import handleSocketIO from './modules/socket-io';
import handleGrpc from './modules/grpc';
import handleTesting from './modules/testing';

const app = express();
const server = http.createServer(app);

// 增加请求体大小限制
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json()); //启用json解析

const port = DEFAULT_PORT;
const io = socketIO(server, { cors: true });

const DEFAULT_WORKSPACE: {
  http: HttpPool;
  websocket: WSPool;
  socket_io: SocketIOPool;
  grpc: GrpcPool;
  testing: TestingPool;
} = {
  http: {},
  websocket: {},
  socket_io: {},
  grpc: {},
  testing: {},
};

const UserPools = {};

// 连接后的事物处理
io.on('connection', (socket) => {
  UserPools[socket.id] = cloneDeep(DEFAULT_WORKSPACE);
  const ConnectionPools = UserPools[socket.id];
  const emitter = new EventEmitter();
  Object.keys(RUNTIME_EMMITS).forEach((name) => {
    emitter.on(name, (type, runtime_id, ...args) => {
      // if (isUndefined(ConnectionPools[name]?.[runtime_id])) {
      //   return;
      // }
      socket.emit(name, type, runtime_id, ...args);
    });
  });

  try {
    socket.on('http', handleHttp.bind(null, ConnectionPools.http, emitter));
    socket.on('websocket', handleWebsocket.bind(null, ConnectionPools.websocket, emitter));
    socket.on('socket_io', handleSocketIO.bind(null, ConnectionPools.socket_io, emitter));
    socket.on('grpc', handleGrpc.bind(null, ConnectionPools.grpc, emitter));
    socket.on('testing', handleTesting.bind(null, ConnectionPools.testing, emitter));
  } catch (error) {
    emitter.emit('global', 'error', error?.message);
  }

  socket.on('disconnect', (msg) => {
    UserPools[socket.id] = null;
  });
});

// 清除占用接口的其他进程并启动服务
clearUsedPort(port).then((res) => {
  try {
    server.listen(port, '0.0.0.0', () => {
      app.get('/', (req, res) => {
        res.send('Hello World!');
      });
    });
    console.log(`Server listening on ${port}...`);
  } catch (error) {
    console.log('clearUsedPort', String(error));
  }
});
