const log4js = require('log4js')

/**
 * log4js日志配置
 */
log4js.configure({
  // 日志输出目标
  appenders: {
    // 输出到终端，在pm2环境下日志会被pm2收集到自身日志中
    default: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%p] %c - %m'
      }
    }
  },
  // 日志类型，打印出的日志会有标识
  categories: {
    // 默认类型
    default: {
      appenders: ['default'],
      level: 'trace'
    },
    // 路由类型
    router: {
      appenders: ['default'],
      level: 'trace'
    },
    // 接口&逻辑类型
    api: {
      appenders: ['default'],
      level: 'trace'
    },
    // 微信相关类型
    wechat: {
      appenders: ['default'],
      level: 'trace'
    }
  },
  pm2: true,  // 支持pm2
  disableClustering: true  // 支持pm2
})

const logger = function (name) {
  return log4js.getLogger(name)
}

module.exports = logger
