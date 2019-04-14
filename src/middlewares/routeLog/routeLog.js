const logger = require('../../config/log')('router')

/**
 * 路由日志
 */
function routeLog () {
  return async function log (ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start
    logger.info(`${ctx.request.method} ${ctx.request.url} ${ctx.response.status} ${ms}ms ${ctx.request.origin} ${ctx.request.ip} ${ctx.request.header['user-agent']}`)
  }
}

module.exports = routeLog
