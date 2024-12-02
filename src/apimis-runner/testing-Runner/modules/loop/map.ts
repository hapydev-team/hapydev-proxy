import { isArray, isString } from 'lodash';
import ApimisSandbox from '../../../../apimis-sandbox';
import { LoopProcess } from '../../../../types/testing';
import main from '../../main';
import { getIterationDatas } from '../../utils';

const getArray = (textData) => {
  try {
    return JSON.parse(textData);
  } catch (ex) {
    return textData;
  }
};

//遍历测试数据
const getDataList = (item, iteration_data, config, options) => {
  const loopItem = item as LoopProcess;
  const mapConfig = loopItem.data.map;
  //使用测试数据
  if (mapConfig?.location === 'iteration_data') {
    return getIterationDatas(iteration_data, mapConfig?.data, config.env_id);
  }
  //使用环境变量
  if (mapConfig?.location === 'env_variable') {
    const sandBox = new ApimisSandbox({});
    sandBox.initSandbox({
      variables: options?.variables,
    });
    const varList = getArray(sandBox.replaceVariables(mapConfig?.data, null, -1));
    if (isString(varList)) {
      return [varList];
    }
    if (isArray(varList)) {
      return varList;
    }
    return [];
  }
  if (mapConfig?.location === 'constant') {
    const varList = getArray(mapConfig?.data);
    if (isString(varList)) {
      return [varList];
    }
    if (isArray(varList)) {
      return varList;
    }
    return [];
  }
};

const executeMap = async function (item, iteration_data, config, options) {
  const loopItem = item as LoopProcess;
  const listData = getDataList(item, iteration_data, config, options);
  const mapConfig = loopItem.data.map;

  //使用测试数据进行迭代
  if (mapConfig?.location === 'iteration_data') {
    await main.call(
      this,
      {
        iteration_data,
        config: {
          ...config,
          iteration_data_id: mapConfig.data,
          execute_count: listData.length,
          interval_time: loopItem.data.interval_time,
          exception_handler: loopItem.data.exception_handler,
        },
        process: loopItem.children,
      },
      options
    );
    return;
  }

  //使用环境变量或固定值进行迭代
  for (const dataItem of listData) {
    await main.call(
      this,
      {
        iteration_data,
        config: {
          ...config,
          execute_count: 1,
          interval_time: loopItem.data.interval_time,
          exception_handler: loopItem.data.exception_handler,
          temporary: {
            $: dataItem,
          },
        },
        process: loopItem.children,
      },
      options
    );
  }
};

export default executeMap;
