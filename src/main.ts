import { env } from 'config/config'
import { registerGlobalExceptionHandler } from './global-exception'
import { Container } from '@spring4js/container-node'
import glob from 'fast-glob'
import path from 'path'
import { setContainer } from 'utils/global-var'
import WebServer from './WebServer'
import isObject from 'lodash/isObject'
import { configureLogger } from 'config/log4js'
import { initAsyncContext } from './utils/trace'
import log4js from "log4js";

const logger = log4js.getLogger("main");

async function main() {
  // 配置
  initAsyncContext()
  configureLogger()
  registerGlobalExceptionHandler()

  // 初始化容器
  const container = new Container()
  const dirList = [path.resolve(__dirname, 'controller'), path.resolve(__dirname, 'service')]

  const pattern =  ['**/*.ts', '**/*.js']

  for (const dir of dirList) {
    const fileList: string[] = await glob(pattern, {
      cwd: dir,
    })
    for (const file of fileList) {
      const fullPath = path.join(dir, file)
      logger.info(`注册服务类 ${file}`)
      const obj: any = require(fullPath)
      // @ts-ignore
      if (!isObject(obj) || !isObject(obj.default)) {
        continue
      }
      // @ts-ignore
      const clazz = <IServiceClazz>obj.default
      clazz.jsFile = file
      container.registerServiceClazz(clazz)
    }
  }

  // 挂载到全局
  setContainer(container)

  // 初始化http
  let httpServer = new WebServer({ container, port: env.PORT })
  await httpServer.start()
}

main()
