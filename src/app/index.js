const ctrl  = require('./controllers/index')

/**
 * 整个模块的路由配置
 */
module.exports = {
  '/i/wechatinit': { ctrl: ctrl.wechatInit },
  '/i/wechatpush': { ctrl: ctrl.wechatPush }
}
