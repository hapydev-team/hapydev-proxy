export interface DefaultData {
  list_data: Record<string, string>[];
}

export interface EnvData extends DefaultData {
  use_default?: 1 | -1;
}

export type TestDataConfig = {
  default: DefaultData;
  env_configs: { [env_id: string]: Partial<EnvData> };
};

export type IterationData = {
  id: string;
  name: string;
  updated_time: string;
  config: TestDataConfig;
};
