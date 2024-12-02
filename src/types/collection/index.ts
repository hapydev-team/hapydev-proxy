import { ApiRequest } from './api';
import { FolderRequest } from './folder';
import { DataItem } from './dataItem';
import { WebsocketBody, WebsocketConfig, WebsocketRequest } from './websocket';

export type ApimisCollection<T> = {
  id: string;
  parent_id: string;
  name: string;
  data: {
    server_id?: 'default' | string;
    api_type: string;
    request: T;
    description: string;
    websocket_config?: WebsocketConfig;
    websocket_messages?: WebsocketBody[];
  };
};

export { ApiRequest, FolderRequest, WebsocketRequest, DataItem };
