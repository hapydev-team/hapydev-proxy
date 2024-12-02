import { ApiRequest } from '../collection';
import { IterationData } from './iteration_data';

export interface BaseTesting {
  test_id: string;
  project_id: string;
  parent_id: string;
  type: 'folder' | 'test_case';
  name: string;
  sort: number;
  version?: number; //版本号
  etag?: string;
  status: 1 | -1 | -2; //1正常 -1逻辑删除 -2物理删除
}

export type TestingConfig = {
  env_id: string;
  execute_count: number;
  interval_time: number;
  iteration_data_id: string;
  enable_sandbox: 1 | -1;
  save_cookies: 1 | -1; //自动保存cookie
  exception_handler: 'ingore' | 'next_loop' | 'exit_loop' | 'stop_runner';
  temporary?: any;
};

export type ProcessType = 'api' | 'group' | 'if' | 'loop' | 'wait';

export interface BaseProcess {
  id: string;
  parent_id: string;
  type: ProcessType;
  children?: ProcessItem[];
  is_used: 1 | -1;
}
export interface ApiProcess extends BaseProcess {
  data: {
    api_id: string;
    is_link: 1 | -1;
    request?: ApiRequest;
  };
}

export interface GroupProcess extends BaseProcess {
  data: {
    name: string; //分组名称
  };
}

export type Assertion = {
  var: string; //参与比较变量名
  compare: string; //比较方式
  value?: string; //变量值
};

export interface IfProcess extends BaseProcess {
  data: Assertion;
}

export type LoopData = {
  loop_type: 'for' | 'map' | 'while'; //循环类型
  for?: {
    execute_count: number; //执行次数
    iteration_data_id: string; //引用测试数据ID
  }; //循环次数
  map?: {
    location: 'iteration_data' | 'env_variable' | 'constant';
    data: string;
  };
  while?: Assertion; //  断言成功则进入循环
  interval_time: number; //循环间隔
  exception_handler: 'ingore' | 'next_loop' | 'exit_loop' | 'stop_runner';
};

export interface LoopProcess extends BaseProcess {
  data: LoopData;
}

export interface WaitProcess extends BaseProcess {
  data: {
    wait_time: number; //等待时间 单位:毫秒
  };
}

export type ProcessItem = ApiProcess | GroupProcess | IfProcess | LoopProcess | WaitProcess;

export interface Testing extends BaseTesting {
  data: {
    iteration_data: IterationData[];
    config: TestingConfig;
    process: ProcessItem[];
  };
}

export interface TestingFolder extends BaseTesting {
  data: null;
}
