import { GroupProcess } from '../../../types/testing';
import main from '../main';

const executeGroup = async function (item, iteration_data, config, options) {
  const groupItem = item as GroupProcess;
  await main.call(
    this,
    {
      iteration_data,
      config: {
        ...config,
        execute_count: 1,
      },
      process: groupItem.children,
    },
    options
  );
  return null;
};

export default executeGroup;
