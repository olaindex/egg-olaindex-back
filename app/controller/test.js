'use strict'

const Controller = require('egg').Controller
class TestController extends Controller {
  async index() {
    const {ctx, service} = this
    try {
      // await app.model.authenticate()
      // const username = 'admin'
      // const password = ctx.helper.hash('123456')
      // const user = await app.model.User.create({
      //   username,
      //   password,
      //   status: 1,
      //   is_admin: 1,
      // })
      // user.save()
      //   const setting = await app.model.Setting.create({
      //     name: 'app',
      //     value: 'olaindex',
      //   })
      //   setting.save()
      const token = service.jwt.signToken(
        {
          data: {user_id: 1},
        },
        {expiresIn: '7 days'},
      )
      ctx.body = ctx.helper.response({token})
    } catch (error) {
      ctx.logger.error(error)
      ctx.body = ctx.helper.renderError(error.code)
    }
  }
}

module.exports = TestController
