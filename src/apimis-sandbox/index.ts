import { cloneDeep, isFunction, isObject } from 'lodash';
import fakerGenerators from './fakerGenerators';
import { convertFakerVariables, replaceVariable } from './utils';
import Postman from './postman';
import { ApiRequest } from '../types/collection';
import { Variables } from '../types/options';
import { presetVariables } from './variableHelper/utils';
import { OnAssert, OnConsole, OnVisualizing } from './type';
const vm = require('node:vm');
const tv4 = require('tv4');

type InitOptions = {
  request?: ApiRequest;
  variables: Variables;
};

type Options = {
  onConsole?: OnConsole;
  onVisualizing?: OnVisualizing;
  onAssert?: OnAssert;
};

class ApimisSandbox {
  public postman: Postman;
  private onConsole: OnConsole;
  private onVisualizing: OnVisualizing;
  private onAssert: OnAssert;
  public result: any;

  //内置变量
  private insideVariables = {};
  // 自定义变量
  private variables = {
    global: {}, // 全局变量
    environment: {}, // 环境变量
    collection: {}, // 目录变量
    temporary: {}, // 临时变量，无需存库
    iterationData: {}, // 流程测试时的数据变量，临时变量，无需存库
  };

  constructor(options: Options) {
    this.insideVariables = convertFakerVariables(fakerGenerators); //初始化内置变量
    this.onConsole = isFunction(options.onConsole) ? options.onConsole : () => undefined;
    this.onVisualizing = isFunction(options.onVisualizing)
      ? options.onVisualizing
      : () => undefined;
    this.onAssert = isFunction(options.onAssert) ? options.onAssert : () => undefined;
  }

  //初始化沙盒相关参数
  public initSandbox(options: InitOptions) {
    const { request, variables } = options;
    this.variables = presetVariables(variables);
    this.postman = new Postman({
      request,
      variables: this.variables,
      replaceVariables: this.replaceVariables,
      onAssert: this.onAssert,
      onVisualizing: this.onVisualizing,
    });
  }

  //更新result
  public updateResult(result) {
    this.result = result;
    if (isObject(this.postman)) {
      this.postman.setResult(result.response);
    }
  }

  //获取内置变量
  public getInsideVariables() {
    return cloneDeep(this.insideVariables);
  }

  //替换变量
  public replaceVariables = (variablesStr, type, withMock) => {
    return replaceVariable(variablesStr, type, {
      withMock,
      insideVariables: this.getInsideVariables(),
      variables: this.variables,
    });
  };

  //执行脚本
  public async execute(script) {
    const consoleFN = {
      log: this.onConsole.bind(null, 'log'),
      error: this.onConsole.bind(null, 'error'),
      info: this.onConsole.bind(null, 'info'),
      warn: this.onConsole.bind(null, 'warn'),
    };
    const contextifiedObject = vm.createContext({
      tv4,
      pm: this.postman,
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      setInterval: setInterval,
      clearInterval: clearInterval,
      console: consoleFN,
    });

    try {
      const compiledScript = new vm.Script(`(async function(){${script}})()`);
      await compiledScript.runInContext(contextifiedObject, {
        timeout: 5000,
        breakOnSigint: true,
      });

      // await vm.runInContext(`(async function(){${script}})()`, contextifiedObject, {
      //   timeout: 1000,
      //   microtaskMode: 'afterEvaluate',
      // });
    } catch (err) {
      this.onConsole?.('error', err?.message);
    }
  }

  public stop = () => {
    // this.console = null;
  };
}

export default ApimisSandbox;
