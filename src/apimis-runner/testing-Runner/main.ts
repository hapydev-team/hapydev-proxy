import { ApiOptions } from '../../types/options';
import { Testing } from '../../types/testing';
import { Get } from '../../types/get';
import {
  delay,
  getApiSuccessRates,
  getAssertuccessRates,
  getCurrentIterationData,
  getIterationDatas,
} from './utils';
import handleExecuteApi from './modules/api';
import executeWait from './modules/wait';
import executeIf from './modules/if';
import executeGroup from './modules/group';
import executeLoop from './modules/loop';
import { isNull, isPlainObject, isUndefined } from 'lodash';

const main = async function (
  testing_data: Get<Testing, 'data'>,
  options: ApiOptions,
  isRoot = false,
  project_id?: string
) {
  const { process, config, iteration_data } = testing_data;

  if (this.isStop === 1) {
    return;
  }
  const processList = process.filter((item) => item.is_used === 1);

  let exit_loop = -1;
  for (let index = 0; index < config?.execute_count; index++) {
    if (exit_loop === 1) {
      return;
    }
    let exit_process = -1;

    for (let itemIndex = 0; itemIndex < processList.length; itemIndex++) {
      const item = processList[itemIndex];
      if (this.isStop === 1) {
        return;
      }
      if (exit_process === 1) {
        return;
      }
      if (item.is_used !== 1) {
        continue;
      }
      if (config?.interval_time > 0) {
        await delay(config?.interval_time);
      }
      this.onRunning(item.id);
      const iterationDataList = getIterationDatas(
        iteration_data,
        config.iteration_data_id,
        config.env_id
      );
      const currentIterationData = getCurrentIterationData(iterationDataList, index);
      const preTemporary = options.variables?.temporary;
      const preIterationData = options.variables?.iterationData;

      if (!isUndefined(config?.temporary)) {
        options.variables.temporary = config?.temporary;
      }
      if (!isUndefined(currentIterationData)) {
        options.variables.iterationData = currentIterationData;
      }

      let result = {} as any;
      //接口
      if (item.type === 'api') {
        result = await handleExecuteApi.call(this, item, options);
      }

      //等待运算符
      if (item.type === 'wait') {
        result = await executeWait(item);
      }

      //条件运算符
      if (item.type === 'if') {
        result = await executeIf.call(this, item, iteration_data, config, options);
      }

      //分组
      if (item.type === 'group') {
        result = await executeGroup.call(this, item, iteration_data, config, options);
      }

      //循环
      if (item.type === 'loop') {
        result = await executeLoop.call(this, item, iteration_data, config, options);
      }

      //恢复原来的值
      options.variables.temporary = preTemporary;
      options.variables.iterationData = preIterationData;

      this.onDone({
        report_id: options?.report_id,
        id: item.id,
        type: item.type,
        result,
        time: new Date().valueOf(),
      });

      this.addLogs({
        id: item.id,
        type: item.type,
        result,
      });

      if (isRoot) {
        const allCounts = processList.length * config?.execute_count;
        const executedCount = index * processList.length + itemIndex + 1;
        this.onProgress({
          project_id,
          report_id: options?.report_id,
          api_success_rate: getApiSuccessRates(this.logs),
          assert_success_rate: getAssertuccessRates(this.logs),
          progress: (executedCount * 100) / allCounts,
        });
      }

      if (isPlainObject(result) && !isNull(result?.error)) {
        if (config.exception_handler === 'next_loop') {
          this.exit_process = 1;
          continue;
        }
        if (config.exception_handler === 'exit_loop') {
          exit_loop = 1;
          break;
        }
        if (config.exception_handler === 'stop_runner') {
          this.isStop = 1;
          return;
        }
      }
    }
  }
};

export default main;
