import { cloneDeep, omit } from 'lodash';
const JSON5 = require('json5');
import chai from './utils/chai-postman';

class GrpcResponse {
  private to;
  // #response: any = {};
  responseTime: number;
  code: number;

  constructor(_response) {
    const response = cloneDeep(_response);

    //将响应对象上的属性复制过来
    Object.keys(response).forEach((key) => {
      this[key] = response[key];
    });
    this.responseTime = response.responseTime;
    this.code = response.statusCode;
    this.to = chai.expect(omit(this, ['to'])).to;
  }
}

export default GrpcResponse;
