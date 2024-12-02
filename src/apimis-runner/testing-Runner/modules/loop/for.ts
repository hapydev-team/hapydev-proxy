import { LoopProcess } from '../../../../types/testing';
import main from '../../main';

const executeFor = async function (item, iteration_data, config, options) {
  const loopItem = item as LoopProcess;
  const forConfig = loopItem.data.for;

  await main.call(
    this,
    {
      iteration_data,
      config: {
        ...config,
        iteration_data_id: forConfig.iteration_data_id,
        execute_count: forConfig.execute_count,
        interval_time: loopItem.data.interval_time,
        exception_handler: loopItem.data.exception_handler,
      },
      process: loopItem.children,
    },
    options
  );
};

export default executeFor;
