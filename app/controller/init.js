'use strict'

const path = require('path')
const fs = require('fs-extra')
const Controller = require('egg').Controller
const share = fs.readJsonSync(path.resolve(__dirname, './../../storage/share_conf.json'))
class InitController extends Controller {
  async index() {
    const shareUrl = share.shareUrl
    const {ctx, service} = this
    const params = await service.share.parseShareUrlParams(shareUrl)
    const token = await service.share.getAccessToken(params)
    fs.writeJsonSync(path.resolve(__dirname, './../../storage/share_token.json'), {...params, ...token})
    ctx.body = {...params, ...token}
  }
}

module.exports = InitController
