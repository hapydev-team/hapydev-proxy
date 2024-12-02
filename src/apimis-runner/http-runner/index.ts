import {
  cloneDeep,
  isArray,
  isEmpty,
  isFunction,
  isObject,
  isString,
  isUndefined,
  trim,
} from 'lodash';
import { RunnerRun } from '../../types/runner';
import { getCollectionServerId, getParentFolders } from '../utils';
import ApimisSandbox from '../../apimis-sandbox';
import { DEFAULT_OPTIONS } from '../constants';
import { runTasks } from '../runtasks';
import { replaceRequest } from './replaceRequest';
import { getApiAuth, runPostScripts, runPreScripts } from './collection';
import { getRequestUrl } from './url';
import ApimisSend from '../../apimis-send';
import { ApiRequest } from '../../types/collection';
import { OnAssert, OnConsole, OnHttpErrpr, OnResponse, OnVariables, OnVisualizing } from './type';

type Options = {
  onConsole: OnConsole;
  onVisualizing: OnVisualizing;
  onAssert: OnAssert;
  onHttpErrpr: OnHttpErrpr;
  onResponse: OnResponse;
  onVariables: OnVariables;
};

class HttpRunner {
  private mySandbox: ApimisSandbox;
  private apimisSend: ApimisSend;
  private onHttpErrpr: OnHttpErrpr;
  private onResponse: OnResponse;
  private onVariables: OnVariables;

  constructor(options: Options) {
    this.mySandbox = new ApimisSandbox({
      onAssert: options.onAssert,
      onConsole: options.onConsole,
      onVisualizing: options.onVisualizing,
    });
    this.onResponse = options.onResponse;
    this.onHttpErrpr = options.onHttpErrpr;
    this.onVariables = options.onVariables;
  }

  public run: RunnerRun = async (collection, options = DEFAULT_OPTIONS) => {
    const apihexRequest = cloneDeep(collection?.data?.request);
    if (!apihexRequest) {
      this.onHttpErrpr('请求体无效');
      return;
    }
    const api_server_id = getCollectionServerId(collection?.parent_id, options?.collections);
    const env_pre_url =
      (isUndefined(options?.env_urls?.[api_server_id])
        ? options?.env_urls?.default
        : trim(options?.env_urls?.[api_server_id])) ?? '';

    const auto_convert_field_to_mock = options?.requester?.http?.auto_convert_field_to_mock;

    //沙盒内参数初始化
    this.mySandbox.initSandbox({
      request: apihexRequest,
      variables: options?.variables,
    });

    //依次执行项目及目录预执行脚本
    const parentFolders = getParentFolders(collection?.parent_id, options?.collections);

    //获取实际认证参数
    apihexRequest.auth = getApiAuth(collection, options?.collections);

    await runPreScripts(this.mySandbox, options?.project, parentFolders);

    //1.执行预执行脚本
    if (isArray(apihexRequest?.pre_tasks)) {
      await runTasks(apihexRequest?.pre_tasks, {
        sandbox: this.mySandbox,
      });
    }

    //替换变量
    const requestData: ApiRequest = replaceRequest(
      apihexRequest,
      this.mySandbox.replaceVariables,
      auto_convert_field_to_mock
    );

    const pre_url = this.mySandbox.replaceVariables(env_pre_url, null, auto_convert_field_to_mock);
    //替换路径变量
    let request_url = requestData?.url;
    requestData.params.restful.forEach((item) => {
      if (isString(item?.value) && !isEmpty(item.value) && item.value !== '') {
        request_url = request_url.replace(`/:${item.name}`, `/${item.value}`);
      }
    });
    request_url = this.mySandbox.replaceVariables(request_url, null, auto_convert_field_to_mock);
    requestData.url = getRequestUrl(pre_url, request_url);

    //2.执行接口发送
    this.apimisSend = new ApimisSend(isObject(options) ? options : {});
    try {
      const resp: any = await this.apimisSend.request(requestData);
      if (resp?.status !== 'success') {
        this.onHttpErrpr(resp?.message);
        return;
      }
      this.mySandbox.updateResult(resp?.data); //更新沙盒response对象
    } catch (err) {
      this.onHttpErrpr?.(err?.message);
      return;
    }

    //3.执行后执行脚本
    await runPostScripts(this.mySandbox, options?.project, parentFolders);
    //1.执行后执行脚本
    if (isArray(apihexRequest?.post_tasks)) {
      await runTasks(apihexRequest?.post_tasks, {
        sandbox: this.mySandbox,
      });
    }

    this.onVariables({
      project_id: options?.project_id,
      env_id: options?.env_id,
      variables: options?.variables,
    });

    //检查响应体是否被修改
    const result = this.mySandbox.result;
    const changeBody = this.mySandbox.postman?.response?.changeBody;
    if (!isUndefined(changeBody)) {
      result.response.changeBody = changeBody;
    }
    result.request.body = requestData?.body;
    this.onResponse(result, collection?.project_id);
  };

  public stop = () => {
    if (isFunction(this?.apimisSend?.abort)) {
      this?.apimisSend?.abort();
    }
    this.mySandbox.stop();
  };
}

export default HttpRunner;
