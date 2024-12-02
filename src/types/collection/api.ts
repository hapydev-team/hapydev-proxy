import { Auth } from './auth';
import { BaseCollection } from './base';
import { DataItem } from './dataItem';
import { DataFile } from './file';
import { TaskItem } from './task';

export type BodeMode =
  | 'none'
  | 'form-data'
  | 'urlencoded'
  | 'json'
  | 'xml'
  | 'javascript'
  | 'plain'
  | 'html'
  | 'binary';

export type ApiRequest = {
  url: string;
  method: string;
  auth: Auth;
  headers: {
    sys_header: DataItem[];
    parameter: DataItem[];
  };
  params: {
    parameter: DataItem[];
    restful: DataItem[];
  };
  body: {
    mode: BodeMode;
    // raw_type: 'text' | 'javascript' | 'json' | 'html' | 'xml';
    parameter: DataItem[];
    raw: string;
    raw_schema: any;
    binary: DataFile;
  };
  cookies: DataItem[];
  pre_tasks: TaskItem[];
  post_tasks: TaskItem[];
};

export interface ApiCollection extends BaseCollection {
  data: {
    request: ApiRequest;
    description: string;
    status: string;
  };
}
