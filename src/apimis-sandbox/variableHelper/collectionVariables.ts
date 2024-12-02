import { forEach, isObject } from 'lodash';

class CollectionsVariables {
  collections = {};

  public replaceIn: (val: string) => string;

  constructor(collection, replaceIn) {
    this.collections = collection;
    this.replaceIn = (variablesStr) => {
      return replaceIn(variablesStr, 'collection');
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
    this.collections[key] = value;
  }

  get(key) {
    return this.collections[key];
  }

  has(key) {
    return this.collections.hasOwnProperty(key);
  }

  delete(key) {
    delete this.collections[key];
  }

  unset(key) {
    delete this.collections[key];
  }

  clear() {
    if (isObject(this.collections)) {
      forEach(this.collections, (value, key) => {
        delete this.collections[key];
      });
    }
    this.collections = {};
  }

  toObject() {
    return this.collections;
  }
}

export default CollectionsVariables;
