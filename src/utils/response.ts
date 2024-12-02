import { cloneDeep } from 'lodash';
const JSON5 = require('json5');
import chai from './chai-postman';

class Response {
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

  /*
 value(assert) {
                try {
                    const _response = _.cloneDeep(pm.response);

                    if (_.isFunction(_response.json)) {
                        _response.json = _response.json();
                    }

                    chai.assert.isTrue(new Function('response', 'request', 'window', `return ${String(assert)}`)(_response, _.cloneDeep(pm.request)));
                    emitAssertResult(RUNNER_RESULT_LOG, RUNNER_ERROR_COUNT, 'success', String(assert), '成功', scope, cliConsole);
                    return true; // fixed bug
                } catch (e) {
                    emitAssertResult(RUNNER_RESULT_LOG, RUNNER_ERROR_COUNT, 'error', String(assert), e.toString().replace('AssertionError', '断言校验失败').replace('expected false to be true', '表达式不成立'), scope, cliConsole);
                    return false; // fixed bug
                }
            },
*/

  // public assert(val) {
  //   try {
  //     chai.assert.isTrue(
  //       new Function('response', 'request', 'window', `return ${String(val)}`)(
  //         this.#response,
  //         _.cloneDeep(pm.request)
  //       )
  //     );
  //     return true;
  //   } catch (err) {
  //     return false;
  //   }
  // }
}

export default Response;
