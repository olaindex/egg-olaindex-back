'use strict'

const Service = require('egg').Service

class ResponseService extends Service {
  buildResponse(data = [], code = 0, msg = 'ok') {
    data = {
      data,
      msg,
      code,
      error: code ? msg : '',
    }
    return data
  }
  success(data) {
    return this.buildResponse(data)
  }
  fail(errMsg, errCode) {
    return this.buildResponse([], errCode, errMsg)
  }
}

module.exports = ResponseService
