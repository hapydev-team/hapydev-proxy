import { DataFile } from './file';

export type DataItem = {
  name: string; //参数名
  data_type?: string; //Mock数据类型 String Int供mock使用
  value: string | DataFile[]; //示例值
  is_required?: 1 | -1; //是否必填
  is_used: 1 | -1; //是否使用
  description?: string; //参数描述
  is_empty_row?: boolean; //是否空行
  field_type?: 'file' | 'text';
  content_type?: string; //编码类型
};
