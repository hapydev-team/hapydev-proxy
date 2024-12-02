import { trim, isArray } from 'lodash';

// 检查form-data的body是否为空
const isEmptyBodyData = (arr: any) => {
  let res: any = true;
  if (!isArray(arr)) {
    return res;
  }
  try {
    for (let index = 0; index < arr.length; index++) {
      const item = arr[index];
      if (parseInt(item.is_used) === 1 && trim(item.name) != '') {
        res = false;
        break;
      }
    }
  } catch (e) {
    return res;
  }
  return res;
};

export default isEmptyBodyData;
