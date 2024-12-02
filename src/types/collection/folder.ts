import { Auth } from './auth';
import { BaseCollection } from './base';
import { TaskItem } from './task';

export type FolderRequest = {
  auth: Auth;
  pre_tasks: TaskItem[]; //预执行任务
  post_tasks: TaskItem[]; //后执行任务
};

export interface FolderCollection extends BaseCollection {
  data: {
    server_id: string;
    request: FolderRequest;
    description: string;
    status: string;
  };
}
