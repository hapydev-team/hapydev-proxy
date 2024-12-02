import { assign, forEach, get, isFunction, isObject, isString, isUndefined, replace } from 'lodash';

import dayjs from 'dayjs';
import { DataItem } from '../types/collection';
import Mock from 'mockjs';

export const convertFakerVariables = (fakerGenerators) => {
  const insideVariables = {};
  forEach(fakerGenerators, (item, key) => {
    if (!isFunction(item.generator)) {
      return;
    }
    insideVariables[key] = (function () {
      try {
        return item.generator();
      } catch (e) {
        return '';
      }
    })();
  });
  return insideVariables;
};

export const getDynamicVariables = (variables, type) => {
  if (variables.hasOwnProperty(type)) {
    return isObject(variables?.[type]) ? variables[type] : {};
  }
  const allVariables = {};
  Object.keys(variables).forEach((type) => {
    assign(allVariables, variables[type]);
  });
  return allVariables;
};

export const replaceVariable = (variablesStr, type, options) => {
  const { withMock = false, insideVariables, variables } = options;

  if (!isString(variablesStr)) {
    return variablesStr;
  }
  const allVariables = { ...insideVariables, ...getDynamicVariables(variables, type) };
  if (withMock === 1 || withMock === true) {
    try {
      variablesStr = Mock.mock(variablesStr);
    } catch (e) {}
  }
  variablesStr = replace(variablesStr, /{{[^{}]+?}}/gi, (key) => {
    const trimKey = String(replace(key, /[{}]/gi, ''));
    let newValue = get(allVariables, trimKey);
    if (isString(newValue)) {
      newValue = newValue.replace(/\n/g, '\\n');
    }
    if (!isUndefined(newValue)) {
      return newValue;
    }
    return key;
  });
  return variablesStr;
};

export const getConsoleFn = (emitRuntimeEvent) => {
  const consoleFn = {};
  new Array('log', 'warn', 'info', 'error').forEach((method) => {
    Object.defineProperty(consoleFn, method, {
      configurable: true,
      value() {
        emitRuntimeEvent({
          message: {
            type: method,
            data: Array.from(arguments),
          },
          timestamp: Date.now(),
          datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        });
      },
    });
  });

  return consoleFn;
};

export const setHeader = (parameter, name, value) => {
  const headerItem: DataItem = parameter.find((item) => item.name === name);
  if (isObject(headerItem) && headerItem.is_used === 1) {
    return parameter;
  }
  const newItem: DataItem = {
    name: name,
    data_type: 'String',
    value: value,
    is_required: -1,
    is_used: 1,
    description: '',
  };
  parameter.push(newItem);

  return parameter;
};

export const removeHeader = (parameter, name) => {
  const result: DataItem[] = parameter;
  const dataIndex = result.findIndex((item: DataItem) => item.name === name && item.is_used === 1);
  if (dataIndex !== -1) {
    result.splice(dataIndex, 1);
  }
  return result;
};
