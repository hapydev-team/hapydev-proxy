import { isUndefined, trim } from 'lodash';
import ApimisSandbox from '../../apimis-sandbox';
import { WebsocketCollection } from '../../types/collection/websocket';
import { SandboxOptions } from '../../types/options';
import {
  EventConsole,
  EventMessage,
  EventConnectionError,
  EventConnectionOpen,
  EventConnectionClose,
} from './type';
import { getCollectionServerId } from '../utils';
import { getWebsocketUrl } from '../url';
import WebSocketClient from './websocket';

type Options = {
  onConnOpen: EventConnectionOpen;
  onConnError: EventConnectionError;
  onConnClose: EventConnectionClose;
  onConsole: EventConsole;
  onMessage: EventMessage;
  onSent: EventMessage;
};

class WebSocketRunner {
  private onConnOpen: EventConnectionOpen;
  private onConnError: EventConnectionError;
  private onConnClose: EventConnectionClose;
  private onMessage: EventMessage;
  private onSent: EventMessage;
  private mySandbox: ApimisSandbox;
  private myWSClient;
  private myWSConnection;
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

  startConnection(collection: WebsocketCollection, options: SandboxOptions) {
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

    const wsclient = new WebSocketClient();
    wsclient.on('connectFailed', (error) => {
      this.onConnError({
        message: error?.message,
        requestUrl,
      });
    });
    wsclient.on('connect', (connection, requestOptions, responseHeaders) => {
      connection.on('message', this.onMessage);
      connection.on('close', (code, description) => {
        this.onConnClose({
          requestUrl,
          code,
          description,
        });
      });
      this.myWSConnection = connection;
      this.onConnOpen({
        requestUrl,
        requestOptions,
        responseHeaders,
      });
    });
    try {
      wsclient.connect(requestUrl, undefined, undefined, requestHeaders);
    } catch (error) {
      this.onConnError({
        message: error?.message,
        requestUrl,
      });
    }
  }

  //取消链接
  cancelConnection() {
    if (!isUndefined(this.myWSClient)) {
      this.myWSClient.abort();
    }
  }

  //关闭链接
  closeConnection() {
    if (!isUndefined(this.myWSConnection)) {
      this.myWSConnection.close(1000, '用户主动断开链接');
    }
  }

  //发送消息
  sendMessage(message) {
    if (!this.myWSConnection.connected) {
      // this.onConnError({
      //   message: '链接已关闭',
      // });
      return;
    }
    const data = this.mySandbox.replaceVariables(message, null, false);
    this.onSent(data);
    this.myWSConnection.sendUTF(data);
  }
  closeAll() {}
}

export default WebSocketRunner;
