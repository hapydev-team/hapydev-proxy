import { ApimisCollection, FolderRequest } from './collection';
import { ApiCollection } from './collection/api';
import { BaseCollection } from './collection/base';
import { ProjectDetails } from './project';
import { ClientCertInfo } from './settings';
type Environment = {
  env_id: string;
  env_name: string;
  servers: {
    [key: string]: string;
  };
};

type Proxy = {
  system: {
    is_used: 1 | -1;
    env_first: 1 | -1;
    auth: {
      is_used: 1 | -1;
      username: string;
      password: string;
    };
  };
  custom: {
    is_used: 1 | -1;
    proxy_type: Array<'HTTP' | 'HTTPS'>;
    proxy_url: string;
    proxy_port: number;
    proxy_bypass: string;
    auth: {
      is_used: 1 | -1;
      username: string;
      password: string;
    };
  };
};

type CACert = {
  is_used: 1 | -1; //是否使用CA证书
  path: string; //本地路径
  base64: string; //证书base64地址
};

type CertFileInfo = {
  path: string; //本地路径
  base64: string; //base64地址
  file_name: string; //文件名
};

//客户端证书
type ClientCert = {
  host: string; //域名
  password: string; //密码
  crt: CertFileInfo;
  key: CertFileInfo;
  pfx: CertFileInfo;
};

type Http = {
  timeout: number; //接口请求超时时间 单位毫秒
  follow_redirect: 1 | -1; //请求是否自动重定向
  max_requst_loop: number; //最大重定向次数
  auto_convert_field_to_mock: 1 | -1; //是否自动将参数转换成mock变量
  auto_request_param_to_json: 1 | -1; //发送数据 json 化
};

export type Requester = {
  http: Http; //http相关设置
  proxy: Proxy; //代理相关信息
  ca_cert: CACert; //CA证书信息
  client_certs: ClientCertInfo[]; //客户端证书信息
};

type Connection = {
  type: 'mysql' | 'sqlserver' | string; //数据库类型
  dbconfig: any;
  ssh: any;
};

// export type Options = {
//   parent_event_id?: string;
//   iteration_count: number; //迭代次数
//   iteration_datas: any; //当前环境下迭代数据集合
//   iterates_data_id: string; //迭代数据id
//   interval_time: number; //间隔时间
//   enable_sandbox: 1 | -1; //沙盒模式
//   ignore_error: 1 | -1; //忽略错误继续执行
//   project?: any; //项目全局信息，header，query，body认证/预执行任务/后执行任务相关信息
//   cookies?: any[]; //cookie相关数据 cookie
//   environment: Environment; //运行环境
//   variables: {
//     global: any; //全局变量
//     environment: any; //环境变量
//     collection: any; //局部变量
//   };
//   requester: Requester;
//   collections: { [api_id: string]: ApimisCollection };
//   dbconnections: Connection;
// };

//变量相关
export type Variables = {
  global: any; //全局变量
  environment: any; //环境变量
  collection: any; //局部变量
  temporary: any; // 临时变量，无需存库
  iterationData: any; // 流程测试时的数据变量，临时变量，无需存库
};

export type ApiOptions = {
  project?: ProjectDetails; //项目全局信息，header，params，body认证/预执行任务/后执行任务相关信息
  cookies?: any[]; // 全局 cookie相关数据 cookie
  variables: Variables;
  requester: Requester; //代理相关
  project_id: string;
  env_id: string;
  env_name?: string; //环境名称
  user_name?: string; //用户名
  env_urls: { [server_id: string]: string }; // 环境下多服务参数
  collections: { [api_id: string]: ApiCollection }; // 父级目录相关信息
  dbconnections: { [key: string]: Connection }; //数据库连接相关参数
  report_id?: string;
};

export type SandboxOptions = {
  variables: Variables;
  env_id: string;
  env_urls: { [server_id: string]: string }; // 环境下多服务参数
  collections: { [api_id: string]: ApimisCollection<FolderRequest> }; // 父级目录相关信息
};
