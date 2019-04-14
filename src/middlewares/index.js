const routeLog   = require('./routeLog/routeLog')

module.exports = (app) => {
  // 记录路由日志
  app.use(routeLog())
}
