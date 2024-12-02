import { forEach, isObject } from 'lodash';

class GlobalVariables {
  globals = {};

  public replaceIn: (val: string) => string;

  constructor(globals, replaceIn) {
    this.globals = globals;
    this.replaceIn = (variablesStr) => {
      return replaceIn(variablesStr, 'global');
    };
  }

  set(key, value) {
    if (isObject(value)) {
      try {
        value = JSON.stringify(value);
      } catch (e) {
        value = String(value);
      }
    }
    this.globals[key] = value;
  }

  get(key) {
    return this.globals[key];
  }

  has(key) {
    return this.globals.hasOwnProperty(key);
  }

  delete(key) {
    delete this.globals[key];
  }

  unset(key) {
    delete this.globals[key];
  }

  clear() {
    if (isObject(this.globals)) {
      forEach(this.globals, (value, key) => {
        delete this.globals[key];
      });
    }
    this.globals = {};
  }

  toObject() {
    return this.globals;
  }
}

export default GlobalVariables;
