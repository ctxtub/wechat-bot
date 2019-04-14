const path        = require('path')
const Koa         = require('koa')
const views       = require('koa-views')
const parser      = require('koa-bodyparser')
const koaStatic   = require('koa-static')
const app         = new Koa()
const { port }    = require('./config/base')
const middlewares = require('./middlewares/index')
const register    = require('./common/register')

// 页面
app.use(views(path.join(__dirname, './app'), {
  extension: 'ejs'
}))
// post参数解析
app.use(parser())
// 自定义拦截器
middlewares(app)
// 模块注册
app.use(register.start())
// 静态资源支持
app.use(koaStatic(path.join(__dirname, '../static')))

app.listen(port)
