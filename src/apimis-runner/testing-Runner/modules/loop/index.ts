import { LoopProcess } from '../../../../types/testing';
import main from '../../main';
import executeFor from './for';
import executeMap from './map';
import executeWhile from './while';

const executeLoop = async function (item, iteration_data, config, options) {
  const loopItem = item as LoopProcess;
  //循环指定次数
  if (loopItem.data.loop_type === 'for') {
    await executeFor.call(this, item, iteration_data, config, options);
  }

  //满足特定条件
  if (loopItem.data.loop_type === 'while') {
    return executeWhile.call(this, item, iteration_data, config, options);
  }

  //遍历数据
  if (loopItem.data.loop_type === 'map') {
    return executeMap.call(this, item, iteration_data, config, options);
  }
};

export default executeLoop;
