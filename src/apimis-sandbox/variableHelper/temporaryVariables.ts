import { forEach, isObject } from 'lodash';

class TemporaryVariables {
  temporarys = {};
  public getDynamicVariables: () => object;
  public replaceIn: (val: string) => string;

  constructor(temporarys, getDynamicVariables, replaceIn) {
    this.temporarys = temporarys;
    this.getDynamicVariables = getDynamicVariables;
    this.replaceIn = replaceIn;
  }

  public set(key, value) {
    if (isObject(value)) {
      try {
        value = JSON.stringify(value);
      } catch (e) {
        value = String(value);
      }
    }
    this.temporarys[key] = value;
  }

  public get(key) {
    const allVariables = this.getDynamicVariables();

    return allVariables[key];
  }

  public has(key) {
    return this.getDynamicVariables().hasOwnProperty(key);
  }
  public delete(key) {
    delete this.temporarys[key];
  }

  public unset(key) {
    delete this.temporarys[key];
  }

  public clear() {
    if (isObject(this.temporarys)) {
      forEach(this.temporarys, (value, key) => {
        delete this.temporarys[key];
      });
    }
    this.temporarys = {};
  }

  public toObject() {
    return this.getDynamicVariables();
  }

  public toJSON() {
    return this.getDynamicVariables();
  }
}

export default TemporaryVariables;
