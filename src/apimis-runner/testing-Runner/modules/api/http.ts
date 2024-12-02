import { ApiProcess } from '../../../../types/testing';
import HttpRunner from '../../../http-runner';
import { ApiCollection } from '../../../../types/collection/api';
import { cloneDeep } from 'lodash';

export const handleRunHttp = async function (collection, options) {
  const httpResult = {
    name: collection?.name,
    error: null,
    request: null,
    response: null,
    asserts: [],
    env_id: null,
    variables: {},
  };

  const handleAssert = (result: boolean, message: string, description: string) => {
    httpResult.asserts.push({
      result,
      message,
      description,
    });
  };
  const handleHttpError = (err) => {
    httpResult.error = err;
  };

  const handleResponse = (result) => {
    httpResult.response = result.response;
    httpResult.request = result.request;
  };

  const handleVariables = (data) => {
    httpResult.env_id = data?.env_id;
    httpResult.variables = data?.variables;
  };

  const httpRunner = new HttpRunner({
    onAssert: handleAssert,
    onConsole: this.onConsole,
    onHttpErrpr: handleHttpError,
    onResponse: handleResponse,
    onVisualizing: () => undefined,
    onVariables: handleVariables,
  });
  await httpRunner.run(collection, options);
  return httpResult;
};

export const getApiItem = (
  processItem: ApiProcess,
  collections: { [id: string]: ApiCollection }
) => {
  //引用
  if (processItem.data.is_link === 1) {
    return collections?.[processItem?.data?.api_id];
  }
  //复制
  const sourceData = collections?.[processItem?.data?.api_id];
  const result: ApiCollection = cloneDeep(sourceData);
  result.data.request = processItem?.data?.request;
  result.parent_id = '0';
  return result;
};
