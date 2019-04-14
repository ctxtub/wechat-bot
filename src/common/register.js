const Router  = require('koa-router')
const router  = Router()
const logger  = require('../config/log')()
const { routerRoot } = require('../config/base')

/**
 * 模块注册
 */
class Register {
  constructor () {
    this.routers = []
  }
  start () {
    let config = require(`../app/index`)

    Object.entries(config).map(([path, config]) => {
      let { url, ctrl } = config
      this.addRouter({
        routerPath: `${routerRoot}${path}`,
        target: url,
        callback: async ctx => {
          await ctrl({ ctx, url })
        }
      })
    })

    logger.info('注册路由：', this.routers)

    return router.routes()
  }

  /**
   * 路由注册
   * @param routerPath    // 路由地址
   * @param callback      // 回调函数
   */
  addRouter ({ routerPath, callback }) {
    if (this.check(routerPath)) {
      // 错误日志打印
      logger.error(`路由【${routerPath}】已存在，取消注册`)
      return
    }
    // 路由注册
    router.all(routerPath, async (ctx, next) => {
      await callback(ctx)
    })
    // 添加到已注册路由列表中
    this.routers.push(routerPath)
  }

  /**
   * 检查路由是否已被注册
   * @param routerPath
   * @returns {boolean}
   */
  check (routerPath) {
    return this.routers.forEach(key => {
      return key.startsWith(routerPath)
    })
  }
}

module.exports = new Register()
