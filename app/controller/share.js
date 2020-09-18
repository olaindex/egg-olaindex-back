'use strict'

const path = require('path')
const fs = require('fs-extra')
const dayjs = require('dayjs')
const Controller = require('egg').Controller
const token = fs.readJsonSync(path.resolve(__dirname, './../../storage/share_token.json'))
class ShareController extends Controller {
  async index() {
    const {ctx, service} = this
    let {path, preview} = ctx.query
    path = ctx.helper.trim(path, '/')
    const data = await service.share.list(path, token)
    if (data.ListData.Row.length > 0) {
      // 文件夹
      const list = []
      data.ListData.Row.forEach((e) => {
        list.push({
          type: Number(e.FSObjType),
          name: e.LinkFilename,
          size: ctx.helper.formatSize(Number(e.SMTotalFileStreamSize)),
          mime: Number(e.FSObjType) ? '' : ctx.helper.getMime(e.LinkFilename),
          time: dayjs(e.SMLastModifiedDate).format('YYYY-MM-DD HH:mm:ss'),
        })
      })
      ctx.body = service.response.success({list})
    } else {
      const info = await service.share.item(data.ListData.CurrentFolderSpItemUrl, token)
      if (!info.file) ctx.body = service.response.success() // 空文件夹
      if (preview) {
        const data = await ctx.curl(info['@content.downloadUrl'], {
          dataType: 'text',
        })
        ctx.body = data.data
      } else {
        ctx.body = service.response.success(
          {
            type: 0,
            name: info.name,
            size: ctx.helper.formatSize(Number(info.size)),
            mime: info.file.mimeType,
            time: dayjs(info.lastModifiedDateTime).format('YYYY-MM-DD HH:mm:ss'),
          },
          info['@content.downloadUrl'],
        )
      }
    }
  }

  async test() {
    const {ctx, service} = this
    let {path} = ctx.query
    let {accessToken, api_url, share_folder} = await service.share.getAccessToken(token)

    share_folder += '/'
    path = ctx.helper.trim(path, '/')
    if (!path) {
      path = ''
      share_folder = ctx.helper.trim(share_folder, '/')
    }
    try {
      const client = service.graph.initAuthenticatedClient(accessToken, api_url, '')
      const url = `/root:/${share_folder}${path}:/children`
      ctx.logger.info(url)
      const data = await client.api(url).get()
      ctx.body = service.response.success(data)
    } catch (error) {
      ctx.logger.error(error)
      ctx.body = ctx.helper.renderError(error.code)
    }
  }
}
module.exports = ShareController
