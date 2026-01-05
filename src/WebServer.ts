import path from 'path'
import http from 'http'
import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import KoaStatic from 'koa-static'
import mount from 'koa-mount'
import log4js from 'log4js'
import Router from '@koa/router'
import { Container } from '@spring4js/container-node'
import auth from 'middleware/auth'
import monitor from 'middleware/monitor'
import {env} from "./config/config";
import WebSocketService from 'service/ws/WebSocketService'

const logger = log4js.getLogger('WebServer')

export default class WebServer {
  private container: Container
  private port: number

  constructor({ container, port }: { container: Container; port: number }) {
    this.container = container
    this.port = port
  }

  async start() {
    let app = new Koa()
    // 注册中间件
    app.use(monitor())
    app.use(auth())
    app.use(bodyParser())
    // 注册路由
    const apiRouter = await this.assembleRouter()
    app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

    let server = http.createServer(app.callback())
    // 注册静态服务
    app.use(mount(`/static`, KoaStatic(path.resolve(__dirname, '../static'), {
      maxage: env.isDev ? 0 : 60 * 60 * 1000, // 1小时
      gzip: true
    })))

    // 注册websocket
    const webSocketService = await this.container.getServiceInstance(WebSocketService)
    webSocketService.setHttpServer(server)
    // 监听
    server.listen(this.port)

    console.log(`server address: http://127.0.0.1:${this.port}`)
  }

  async assembleRouter() {
    let router = new Router()

    let routerList = this.container.getRouterInfo()
    for (let routerInfo of routerList) {
      let { httpMethod, requestPath, serviceName, functionName } = routerInfo
      logger.info(`注册路由 ${httpMethod} ${requestPath}`)
      let instance = await this.container.getServiceInstance(serviceName)
      // @ts-ignore
      router[httpMethod](requestPath, async (ctx: Context) => {
        try {
          // @ts-ignore
          const ret: any = await instance[functionName](ctx)
          if (ret != undefined) {
            ctx.body = {
              code: 0,
              data: ret,
            }
          }
        } catch (err: any) {
          if (err) {
            logger.error(err)
            const {
              code = err.code || 500,
              msg = err.message || err.msg || err.error || JSON.stringify(err),
              data,
            } = err
            ctx.body = {
              code,
              msg,
              data,
            }
          }
        }
      })
    }
    return router
  }
}
