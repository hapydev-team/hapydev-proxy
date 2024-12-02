import { isArray, isEmpty, isString } from 'lodash';
import { DataItem } from '../../types/collection';
import { Get } from '../../types/get';
const fs = require('fs');

const getFiles = (value: Get<DataItem, 'value'>) => {
  if (!isArray(value)) {
    return [];
  }
  const result: any[] = [];
  for (const fileInfo of value) {
    if (fs.existsSync(fileInfo?.file_path)) {
      result.push(fs.createReadStream(fileInfo?.file_path));
      continue;
    }
    if (!isEmpty(fileInfo?.data_url)) {
      result.push(Buffer.from(fileInfo?.data_url, 'base64'));
    }
  }
  return result;
};

const formatFormData = (forms: FormData, parameters: DataItem[]) => {
  if (!isArray(parameters)) {
    return forms;
  }
  for (const item of parameters) {
    if (item.is_used !== 1) {
      continue;
    }
    let options: any = {};
    if (isString(item.content_type)) {
      options.contentType = item.content_type;
    }
    if (item.field_type !== 'file' && isString(item.value)) {
      forms.append(item.name, item.value);
    } else {
      const files = getFiles(item.value);
      for (const file of files) {
        forms.append(item.name, file, options);
      }
    }
  }
  return forms;
};

export default formatFormData;
