import dayjs from 'dayjs';
import { ApiOptions } from '../../types/options';
import { Testing } from '../../types/testing';
import main from './main';

import {
  EventCancel,
  EventComplete,
  EventConsole,
  EventError,
  EventDone,
  EventRunning,
  EventStart,
  EventProgress,
} from './type';
import { getApiSuccessRates, getAssertuccessRates } from './utils';

type Options = {
  onStart: EventStart;
  onRunning: EventRunning;
  onDone: EventDone;
  onComplete: EventComplete;
  onCancel: EventCancel;
  onError: EventError;
  onConsole: EventConsole;
  onProgress: EventProgress;
};

class TestingRunner {
  onStart: EventStart;
  onRunning: EventRunning;
  onDone: EventDone;
  onComplete: EventComplete;
  onCancel: EventCancel;
  onError: EventError;
  onConsole: EventConsole;
  onProgress: EventProgress;
  isStop = -1; //是否停止运行
  logs = [];
  report_id;

  constructor(options: Options) {
    this.onStart = options.onStart;
    this.onRunning = options.onRunning;
    this.onDone = options.onDone;
    this.onComplete = options.onComplete;
    this.onCancel = options.onCancel;
    this.onError = options.onError;
    this.onConsole = options.onConsole;
    this.onProgress = options.onProgress;
    this.isStop = -1;
    this.logs = [];
  }

  addLogs(log) {
    this.logs.push(log);
  }

  async execute(test_id, testing: Testing, options: ApiOptions) {
    this.isStop = -1;
    this.report_id = options?.report_id;

    const startTime = dayjs().format();
    this.onStart(startTime);
    const timeStart = performance.now();
    await main.call(this, testing.data, options, true, testing?.project_id);

    const finish_time = dayjs().format();
    const cost_time = performance.now() - timeStart;
    this.onComplete({
      test_id,
      results: this.logs,
      variables: options.variables,
      cookies: options.cookies,
      env_id: options?.env_id,
      env_name: options?.env_name,
      user_name: options?.user_name,
      create_time: startTime,
      finish_time,
      cost_time,
      save_cookies: testing?.data?.config?.save_cookies,
      project_id: testing?.project_id,
      report_id: options?.report_id,
      api_success_rate: getApiSuccessRates(this.logs),
      assert_success_rate: getAssertuccessRates(this.logs),
    });
  }

  async cancel(test_id) {
    this.isStop = 1;
    this.onCancel({
      test_id,
      report_id: this.report_id,
      time: dayjs().format(),
    });
  }
}

export default TestingRunner;
