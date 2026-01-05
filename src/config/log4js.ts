import log4js, { LoggingEvent } from 'log4js'
import path from 'path'
import util from 'util'
import { env } from './config'
import { getTraceId } from '../utils/trace'

const LayoutConfig = {
  type: 'pattern',
  pattern: '%d{[yyyy-MM-dd hh:mm:ss.SSS]}[%z][%x{traceId}][%p]%c %x{msg}',
  tokens: {
    traceId: function() {
      return getTraceId()
    },
    msg: function(logEvent: LoggingEvent) {
      let msg = util.format(...logEvent.data)
      // @ts-ignore
      const length = logEvent.data.length || 0
      if (logEvent.data[length - 1] !== 'all' && msg.length > 500) {
        msg = msg.substring(0, 500) + ' ...'
      }
      return msg
    }
  }
}
const MaxLogSize = '10M'
const Backups = 3

export function configureLogger() {
  const mainLogFilePath = path.join(env.LogDir, 'main.log')
  const middlewareLogFilePath = path.join(env.LogDir, 'middleware.log')

  log4js.configure({
    appenders: {
      console: { type: 'console', layout: LayoutConfig },
      main: {
        type: 'file',
        filename: mainLogFilePath,
        maxLogSize: MaxLogSize,
        backups: Backups,
        layout: LayoutConfig,
        compress: true
      },
      middleware: {
        type: 'file',
        filename: middlewareLogFilePath,
        maxLogSize: MaxLogSize,
        backups: Backups,
        layout: LayoutConfig,
        compress: true
      },
      errorToFile: {
        type: 'logLevelFilter',
        appender: 'error',
        level: 'error'
      },
      errorToConsole: {
        type: 'logLevelFilter',
        appender: 'console',
        level: 'error'
      }
    },
    categories: {
      default: { appenders: ['main', env.isDev ? 'errorToConsole' : 'errorToFile'], level: 'info' },
      middleware: {
        appenders: ['middleware', env.isDev ? 'errorToConsole' : 'errorToFile'],
        level: 'info'
      },
    }
  })
}
