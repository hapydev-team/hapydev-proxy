import ApimisSandbox from '../../../apimis-sandbox';
import { IfProcess } from '../../../types/testing';
import { getCompareResult } from '../compare';
import main from '../main';

const executeIf = async function (item, iteration_data, config, options) {
  const ifItem = item as IfProcess;
  const sandBox = new ApimisSandbox({});
  sandBox.initSandbox({
    variables: options?.variables,
  });
  const expectValue = sandBox.replaceVariables(ifItem?.data?.var, null, -1);
  const result = getCompareResult(ifItem.data.compare, expectValue, ifItem.data.value);
  if (result === true) {
    await main.call(
      this,
      {
        iteration_data,
        config: {
          ...config,
          execute_count: 1,
        },
        process: ifItem.children,
      },
      options
    );
  }
  return result;
};

export default executeIf;
