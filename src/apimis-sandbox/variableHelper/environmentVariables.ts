import { forEach, isObject } from 'lodash';

class EnvironmentVariables {
  environment = {};

  public replaceIn: (val: string) => string;

  constructor(environment, replaceIn) {
    this.environment = environment;
    this.replaceIn = (variablesStr) => {
      return replaceIn(variablesStr, 'environment');
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
    this.environment[key] = `${value}`;
  }

  get(key) {
    return this.environment[key];
  }

  has(key) {
    return this.environment.hasOwnProperty(key);
  }

  delete(key) {
    delete this.environment[key];
  }

  unset(key) {
    delete this.environment[key];
  }

  clear() {
    if (isObject(this.environment)) {
      forEach(this.environment, (value, key) => {
        delete this.environment[key];
      });
    }
    this.environment = {};
  }

  toObject() {
    return this.environment;
  }
}

export default EnvironmentVariables;
