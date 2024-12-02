import { ApiOptions, Requester } from '../types/options';

export const DEFAULT_REQUESTER: Requester = {
  http: {
    timeout: 0, //接口请求超时时间 单位毫秒
    follow_redirect: 1, //请求是否自动重定向
    max_requst_loop: 5, //最大重定向次数
    auto_convert_field_to_mock: 1, //自动识别 MOCK 参数(has)
    auto_request_param_to_json: 1, //发送数据 json 化
  },
  proxy: null, //代理相关信息
  ca_cert: null, //CA证书信息
  client_certs: null, //客户端证书信息
};

export const DEFAULT_OPTIONS: ApiOptions = {
  variables: {
    global: {},
    environment: {},
    collection: {},
    temporary: {}, // 临时变量，无需存库
    iterationData: {}, // 流程测试时的数据变量，临时变量，无需存库
  },
  requester: DEFAULT_REQUESTER,
  project_id: null,
  env_id: null,
  env_urls: {
    default: '',
  },
  collections: {},
  dbconnections: {},
  project: {
    pre_scripts: '',
    post_scripts: '',
    auth: {
      type: 'noauth',
    },
  },
};
