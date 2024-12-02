import { forEach, isObject } from 'lodash';

class IterationData {
  iterationData = {};
  replaceIn: (val: string) => string;

  constructor(iterationData, replaceIn) {
    this.iterationData = iterationData;
    this.replaceIn = (variablesStr) => {
      return replaceIn(variablesStr, 'iterationData');
    };
  }

  set(key, value) {
    this.iterationData[key] = value;
  }
  get(key) {
    return this.iterationData[key];
  }
  has(key) {
    return this.iterationData.hasOwnProperty(key);
  }

  toObject() {
    return this.iterationData;
  }
  toJSON() {
    return this.iterationData;
  }
  clear() {
    if (isObject(this.iterationData)) {
      forEach(this.iterationData, (value, key) => {
        delete this.iterationData[key];
      });
    }
    this.iterationData = {};
  }
}

export default IterationData;
