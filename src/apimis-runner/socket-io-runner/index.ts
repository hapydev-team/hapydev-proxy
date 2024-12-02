import { isEmpty, isNumber, isString, isUndefined, trim } from 'lodash';
import ApimisSandbox from '../../apimis-sandbox';
import { SocketIOCollection } from '../../types/collection/socketIO';
import { SandboxOptions } from '../../types/options';
import { getCollectionServerId } from '../utils';
import {
  EventConnectionClose,
  EventConnectionError,
  EventConnectionOpen,
  EventConsole,
  EventMessage,
} from './type';
import { getSocketIO } from './utils';
import { getWebsocketUrl } from '../url';

type Options = {
  onConnOpen: EventConnectionOpen;
  onConnError: EventConnectionError;
  onConnClose: EventConnectionClose;
  onConsole: EventConsole;
  onMessage: EventMessage;
  onSent: EventMessage;
};

class SocketIORunner {
  private onConnOpen: EventConnectionOpen;
  private onConnError: EventConnectionError;
  private onConnClose: EventConnectionClose;
  private onMessage: EventMessage;
  private onSent: EventMessage;
  private mySandbox: ApimisSandbox;
  private myIOClient;
  constructor(options: Options) {
    this.onConnOpen = options.onConnOpen;
    this.onConnError = options.onConnError;
    this.onConnClose = options.onConnClose;
    this.onMessage = options.onMessage;
    this.onSent = options.onSent;
    this.mySandbox = new ApimisSandbox({
      onConsole: options.onConsole,
    });
  }

  startConnection(collection: SocketIOCollection, options: SandboxOptions) {
    this.mySandbox.initSandbox({
      variables: options?.variables,
    });
    const api_server_id = getCollectionServerId(collection?.parent_id, options?.collections);

    const env_pre_url =
      (isUndefined(options?.env_urls?.[api_server_id])
        ? options?.env_urls?.default
        : trim(options?.env_urls?.[api_server_id])) ?? '';

    const pre_url = this.mySandbox.replaceVariables(env_pre_url, null, false);
    const request_url = this.mySandbox.replaceVariables(collection?.data?.request.url, null, false);
    const requestUrl = getWebsocketUrl(pre_url, request_url);

    const requestHeaders = {};
    collection.data?.request?.headers?.parameter.forEach((item) => {
      if (item.is_used === 1) {
        requestHeaders[item?.name] = item.value;
      }
    });

    const version = collection.data.config?.client_version;
    const IO = getSocketIO(version);

    const socket = IO(requestUrl, {
      path: collection.data?.config?.handshake_path ?? '/socket.io',
      extraHeaders: !isEmpty(requestHeaders) ? requestHeaders : undefined,
      reconnectionAttempts: collection.data.config.max_reconnect_count ?? 0, //最多重连次数
      reconnectionDelay: isNumber(collection.data?.config?.reconnect_interval)
        ? collection.data?.config?.reconnect_interval
        : 5000, //重连间隔时间
      timeout:
        collection?.data?.config?.handshake_timeout > 0
          ? collection?.data?.config?.handshake_timeout
          : undefined, //握手超时时间
    });

    // 关闭链接
    if (!isUndefined(this.myIOClient)) {
      socket.offAny();
      this.myIOClient.disconnect();
    }

    socket.on('error', (err) => {
      this.onConnError({
        message: err?.message,
        requestUrl,
      });
    });
    socket.on('connect', () => {
      const engine = socket.io.engine;
      const options = {
        method: 'GET',
        path: collection?.data?.config?.handshake_path,
        hostname: engine.hostname,
        port: engine.port,
        query: engine?.transport?.query,
        headers: requestHeaders,
      };

      this.onConnOpen({
        requestUrl,
        requestOptions: options,
        responseHeaders: null,
      });
    });
    socket.on('disconnect', (reason) => {
      this.onConnClose({
        requestUrl,
        description: reason,
      });
    });
    socket.on('connect_error', (err) => {
      console.log(err.message);
      this.onConnError({
        message: err.context?.responseText ?? err.message,
        requestUrl,
      });
    });

    //绑定事件
    const handleMessage = (event, ...args) => {
      this.onMessage(event, args);
    };
    collection.data?.request.events.forEach((item) => {
      if (item.is_used !== 1 || isEmpty(trim(item?.name))) {
        return;
      }
      socket.on(item?.name, handleMessage.bind(null, item.name));
    });

    this.myIOClient = socket;
  }
  cancelConnection() {
    this.myIOClient.disconnect();
  }

  closeConnection() {
    this.myIOClient.disconnect();
  }

  sendMessage(event, message: any) {
    const data = this.mySandbox.replaceVariables(message, null, false);
    const eventName = isString(event) && trim(event) !== '' ? event : 'message';
    this.onSent(eventName, data);
    this.myIOClient.emit(eventName, data);
  }

  closeAll() {}
}

export default SocketIORunner;
