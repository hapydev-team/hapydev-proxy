import { isEmpty, isString } from 'lodash';
import { TaskItem } from '../types/collection/task';

const excuteScript = async (sandbox, script) => {
  await sandbox.execute(script);
};

export const runTasks = async (task_list: TaskItem[], options) => {
  const { sandbox } = options;

  for await (const taskItem of task_list) {
    if (taskItem.type === 'custom_script') {
      if (!isString(taskItem?.data) || isEmpty(taskItem?.data)) {
        return;
      }
      await excuteScript(sandbox, taskItem?.data);
    }
  }
};
