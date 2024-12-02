export interface BaseReport {
  report_id: string;
  test_case_id: string;
  report_name: string;
  env_id: string;
  creater_id: string;
  creater_name: string;
  api_success_rate: number;
  assert_success_rate: number;
  status: 1 | 2 | 3; //1.运行中 2.已结束 3.已终止
  create_time: number;
  finish_time: number;
}
