import { isArray, isUndefined } from 'lodash';
import { IterationData } from '../../types/testing/iteration_data';

//获取测试数据
export const getIterationDatas = (
  iteration_datas: IterationData[],
  iteration_data_id: string,
  env_id
) => {
  const selectedData: IterationData = iteration_datas.find((item) => item.id === iteration_data_id);
  if (isUndefined(selectedData)) {
    return [];
  }
  const envConfigData = selectedData?.config?.env_configs?.[env_id];

  //使用自定义
  if (envConfigData?.use_default === -1) {
    return envConfigData?.list_data ?? [];
  }
  return selectedData?.config?.default?.list_data ?? [];
};

export const getCurrentIterationData = (iterationData, index) => {
  if (!isArray(iterationData)) {
    return {};
  }

  return iterationData?.[index % iterationData.length];
};

//等待运算符
export const delay = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds);
  });
};

//接口成功率
export const getApiSuccessRates = (testLogs) => {
  const apiListAll = testLogs.filter((item) => item.type === 'api');
  const apiListSuccess = testLogs.filter(
    (item) => item.type === 'api' && item?.result?.error === null
  );
  if (apiListAll.length === 0) {
    return 0;
  }
  return (apiListSuccess.length * 100) / apiListAll.length;
};

//断言成功率
export const getAssertuccessRates = (testLogs) => {
  let assertList = [];
  testLogs.forEach((item) => {
    if (item.type === 'api' && isArray(item?.result?.asserts)) {
      assertList = assertList.concat(item?.result?.asserts);
    }
  });
  if (assertList.length === 0) {
    return 0;
  }
  const successAssertList = assertList.filter((item) => item.result === true);
  return (successAssertList.length * 100) / assertList.length;
};
