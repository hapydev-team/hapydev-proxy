import { ApiProcess } from '../../../../types/testing';
import { getApiItem, handleRunHttp } from './http';

const handleExecuteApi = async function (item, options) {
  const apiItem = item as ApiProcess;
  const collection = getApiItem(apiItem, options?.collections);
  const result = await handleRunHttp.call(this, collection, options);
  return result;
  //   if (!isNull(httpResult?.error)) {
  //     if (config.exception_handler === 'next_loop') {
  //       this.exit_process = 1;
  //       continue;
  //     }
  //     if (config.exception_handler === 'exit_loop') {
  //       exit_loop = 1;
  //       break;
  //     }
  //     if (config.exception_handler === 'stop_runner') {
  //       this.isStop = 1;
  //       return;
  //     }
  //   }
};

export default handleExecuteApi;
