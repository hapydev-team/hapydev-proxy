import nodeAjax from '../../nodeAjax';
import chai from '../../utils/chai-postman';
import { postmanRequest } from './request';
import { isArray } from 'lodash';
import { setHeader, removeHeader, getDynamicVariables } from '../utils';
import { ApiRequest } from '../../types/collection';
import { Variables } from '../../types/options';
import VariablesHelper from '../variableHelper';
import { Visualizing } from './visualizing';
import { OnAssert, OnVisualizing } from '../type';
import HttpResponse from './httpResponse';
import GrpcResponse from './grpcResponse';

type Options = {
  request: ApiRequest;
  variables: Variables;
  replaceVariables: (variablesStr: string, type: string, withMock: boolean) => void;
  onAssert: OnAssert;
  onVisualizing: OnVisualizing;
  response?: any;
};

class Postman {
  #scop: Partial<Options> = {};
  public environment = {};
  public globals = {};
  public variables = {};
  public collectionVariables = {};
  public Visualizing = () => void 0;
  public sendRequest = nodeAjax;
  public expect = chai.expect;
  public response: HttpResponse | GrpcResponse;
  private onAssert;

  constructor(options: Options) {
    this.#scop = options;

    const variablesHelper = new VariablesHelper(
      options.variables,
      this.getDVariables,
      options.replaceVariables
    );
    this.environment = variablesHelper.environment;
    this.globals = variablesHelper.global;
    this.variables = variablesHelper.temporary;
    this.collectionVariables = variablesHelper.collection;
    this.Visualizing = Visualizing.bind(null, options?.onVisualizing);
    this.onAssert = options.onAssert;
  }

  public setResult = (response) => {
    this.response = new HttpResponse(response);
  };
  public setGrpcResult = (response) => {
    this.response = new GrpcResponse(response);
  };

  public getDVariables = (type: any) => {
    return getDynamicVariables(this.#scop?.variables, type);
  };

  public setRequestHeader = (name, value) => {
    const headers = this.#scop?.request?.headers;
    if (isArray(headers?.parameter)) {
      headers.parameter = setHeader(headers?.parameter, name, value);
    }
  };

  public removeRequestHeader = (name) => {
    const headers = this.#scop?.request?.headers;
    if (isArray(headers?.parameter)) {
      headers.parameter = removeHeader(headers.parameter, name);
    }
  };

  public request = postmanRequest(this.#scop?.request, {
    setRequestHeader: this.setRequestHeader,
    removeRequestHeader: this.removeRequestHeader,
  });

  public test = (desc, callback) => {
    try {
      callback();
      this.onAssert(true, '成功', desc);
    } catch (error) {
      this.onAssert(false, error.toString().replace('AssertionError', '断言校验失败'), desc);
    }
  };
}

export default Postman;
