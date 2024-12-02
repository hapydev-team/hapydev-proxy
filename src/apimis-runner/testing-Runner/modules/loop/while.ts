import ApimisSandbox from '../../../../apimis-sandbox';
import { LoopProcess } from '../../../../types/testing';
import { getCompareResult } from '../../compare';
import main from '../../main';

const executeWhile = async function (item, iteration_data, config, options) {
  const loopItem = item as LoopProcess;
  const waileConfig = loopItem.data.while;
  const getResult = () => {
    const sandBox = new ApimisSandbox({});
    sandBox.initSandbox({
      variables: options?.variables,
    });
    const expectValue = sandBox.replaceVariables(waileConfig?.var, null, -1);
    const result = getCompareResult(waileConfig?.compare, expectValue, waileConfig?.value);
    return result;
  };

  let enableRun = true;
  const timeOut = 60 * 1000;
  const outTimer = setTimeout(() => {
    enableRun = false;
  }, timeOut);

  while (enableRun === true && getResult() === true) {
    await main.call(
      this,
      {
        iteration_data,
        config: {
          ...config,
          interval_time: loopItem.data.interval_time,
          exception_handler: loopItem.data.exception_handler,
        },
        process: loopItem.children,
      },
      options
    );
  }
  clearTimeout(outTimer);
};

export default executeWhile;
