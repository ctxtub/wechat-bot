const logger  = require('../config/log')('wechat')
const fs = require('fs')
const Wechat = require('wechat4u')

/**
 * 微信机器人实例
 *
 * @class WechatBot
 */
class WechatBot {
  constructor () {
    this.bot = null
  }

  /**
   * 初始化函数
   *
   * @memberof WechatBot
   */
  init () {
    return new Promise((resolve, reject) => {
      // 防止重复初始化
      if (this.bot && this.bot.state === 'login') return resolve('已有登录用户：' + this.bot.user.NickName)

      /**
       * 尝试获取本地登录数据，免扫码
       * 这里演示从本地文件中获取数据
       */
      try {
        this.bot = new Wechat(require('../../sync-data.json'))
      } catch (e) {
        this.bot = new Wechat()
      }

      /**
       * 启动机器人
       */
      if (this.bot.PROP.uin) {
        // 存在登录数据时，可以随时调用restart进行重启
        this.bot.restart()
      } else {
        this.bot.start()
      }

      /**
       * uuid事件，参数为uuid，根据uuid生成二维码
       */
      this.bot.on('uuid', uuid => {
        resolve('https://login.weixin.qq.com/qrcode/' + uuid)
      })

      /**
       * 登录成功事件
       */
      this.bot.on('login', () => {
        logger.info('登录成功', this.bot.user.NickName)
        resolve('登录成功：' + this.bot.user.NickName)
        // 保存数据，将数据序列化之后保存到任意位置
        fs.writeFileSync('./sync-data.json', JSON.stringify(this.bot.botData))
      })

      /**
       * 登出成功事件
       */
      this.bot.on('logout', () => {
        logger.info('登出成功')
        resolve('登录失败：缓存过期，请重试')
        // 清除数据
        fs.unlinkSync('./sync-data.json')
      })
    })
  }

  /**
   * 发送消息方法
   *
   * @param {String} userName 用户名
   * @param {String} text 消息内容
   *
   * @memberof WechatBot
   */
  sendText ({ userName, text }) {
    return new Promise((resolve, reject) => {
      if (this.bot && this.bot.state === 'login') {
        // 查找群聊信息
        const searchResult = this.bot.Contact.getSearchUser(userName)
        const contactInfo = searchResult[0]
        if (!contactInfo) {
          logger.info('联系人未找到，取消发送')
          resolve('联系人未找到，取消发送')
        }

        this.bot.sendMsg(text, contactInfo.UserName)
          .then(() => {
            logger.info('消息发送成功')
            resolve('消息发送成功')
          })
          .catch(err => {
            logger.error('消息发送失败', err)
            resolve('消息发送失败' + JSON.stringify(err))
            this.bot.emit('error', err)
          })
      } else {
        logger.info('请重新登录微信账号')
        resolve('请重新登录微信账号')
      }
    })
  }
}

const WechatBotInstance = new WechatBot()

module.exports = WechatBotInstance
