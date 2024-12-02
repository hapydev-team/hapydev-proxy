export type TaskItem = {
  id: string;
  type: 'custom_script';
  enabled: 1 | -1;
  data: any;
};
