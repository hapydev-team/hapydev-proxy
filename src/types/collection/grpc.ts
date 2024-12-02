import { BaseCollection } from './base';
import { TaskItem } from './task';

export type GrpcAuth = {
  type: 'noauth' | 'api' | 'basic' | 'bearer';
  api: any;
  basic?: any;
  bearer?: any;
};

export type MetaDataItem = {
  name: string; //参数名
  value: string; //示例值
  is_used: 1 | -1; //是否使用
  description?: string; //参数描述
  is_empty_row?: boolean; //是否空行
};

export type GrpcRequest = {
  url: string;
  is_tls: 1 | -1;
  service_name: string;
  method_name: string;
  message: string;
  auth: GrpcAuth;
  definition: ServiceDefinition;
  meta_data: MetaDataItem[];
  pre_tasks: TaskItem[];
  post_tasks: TaskItem[];
};

export type ServiceMethod = {
  method_name: string;
  request_stream: 1 | -1;
  response_stream: 1 | -1;
};

//proto原始信息
export interface BaseProto {
  name: string;
  path: string;
  code: string;
}

//grpc服务信息
export type GrpcService = {
  service_name: string;
  methods: ServiceMethod[];
};

//服务定义信息
export type ServiceDefinition = {
  is_reflection: 1 | -1; //是否服务反射
  main_proto: BaseProto; //通过文件引入的proto
  is_include_depends: 1 | -1; //是否包含依赖文件
  depend_files: BaseProto[]; //引用的其他文件
  services: GrpcService[];
};

export interface GrpcCollection extends BaseCollection {
  data: {
    request: GrpcRequest;
    description: string;
    status: string;
  };
}
