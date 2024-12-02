import { isNumber } from 'lodash';
import { WaitProcess } from '../../../types/testing';
import { delay } from '../utils';

const executeWait = async function (item) {
  const waitItem = item as WaitProcess;
  if (isNumber(waitItem.data.wait_time) && waitItem.data.wait_time > 0) {
    await delay(waitItem.data.wait_time);
  }
  return null;
};

export default executeWait;
