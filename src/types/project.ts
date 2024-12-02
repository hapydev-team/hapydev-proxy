import { Auth } from './collection/auth';

export type ProjectDetails = {
  auth: Auth; //认证
  pre_scripts: string; //预执行脚本
  post_scripts: string; //后执行脚本
};
