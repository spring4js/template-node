import log4js from 'log4js'
import delay from 'utils/delay'

const logger = log4js.getLogger('global-exception')

export function registerGlobalExceptionHandler() {
  // 异常监听
  process.on('SIGINT', async () => {
    await delay(1000)
    logger.warn('退出：SIGINT')
    process.exit()
  })
  process.on('uncaughtException', function(err) {
    logger.error(err)
  })
  process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
  })
}
