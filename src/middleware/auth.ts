import {Context, Next} from 'koa'
import log4js from 'log4js'

const logger = log4js.getLogger('auth')


export default function auth() {
    return async function _internal_auth_(ctx: Context, next: Next) {
        // 页面负责登录
        await next()
    }
}
