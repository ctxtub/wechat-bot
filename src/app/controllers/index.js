// const fs = require('fs')
// const QRCode = require('qrcode')
const weChat = require('../../common/wechat')

/**
 * 微信初始化接口
 * 提供登录微信号功能
 */
async function wechatInit ({ ctx }) {
  const QRCodeUrl = await weChat.init()

  // const qrocdeData = await QRCode.toDataURL(QRCodeUrl)
  // var transQrocdeData = qrocdeData.replace(/^data:image\/png;base64,/, '');
  // var pngBuffer = new Buffer(transQrocdeData, 'base64')
  // ctx.body = pngBuffer
  // ctx.type = 'png'

  ctx.body = QRCodeUrl

  await ctx
}

/**
 * 发送微信消息接口
 * 入参：
 * @param {String} userName 用户名
 * @param {String} text 消息内容
 */
async function wechatPush ({ ctx }) {
  const query = ctx.query
  const body = ctx.request.body
  const sendResult = await weChat.sendText({
    userName: query.userName || body.userName,
    text: query.text || body.text
  })

  ctx.body = sendResult

  await ctx
}

module.exports = {
  wechatPush,
  wechatInit
}
