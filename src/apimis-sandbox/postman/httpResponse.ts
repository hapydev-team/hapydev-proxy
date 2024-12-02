import { cloneDeep } from 'lodash';
const JSON5 = require('json5');
import chai from './utils/chai-postman';

class HttpResponse {
  rawBody = '';
  public to = {};
  #response: any = {};
  responseTime: number;
  code: number;
  public changeBody;

  constructor(_response) {
    this.#response = cloneDeep(_response);
    try {
      this.rawBody = Buffer.from(this.#response?.stream)?.toString();
    } catch (e) {
      this.rawBody = '';
    }

    //将响应对象上的属性复制过来
    Object.keys(this.#response).forEach((key) => {
      this[key] = this.#response[key];
    });
    this.responseTime = this.#response.elapsedTime;
    this.code = this.#response.statusCode;

    this.to = chai.expect(this).to;
  }

  public json() {
    let result = {};
    try {
      result = JSON5.parse(this.rawBody);
    } catch (e) {}
    return result;
  }

  public text() {
    return this.rawBody;
  }

  public setBody(rawText) {
    this.changeBody = rawText;
  }
}

export default HttpResponse;
