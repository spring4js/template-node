import {Context, Next} from "koa";
import log4js from "log4js";
import {runInAsyncContext} from "../utils/trace";

const logger = log4js.getLogger("middleware.monitor");
export default function monitor() {
    return async function (ctx: Context, next: Next) {
        await runInAsyncContext('http', async () => {
            const startTime = Date.now()
            logger.info(`收到请求 ${ctx.method} ${ctx.href}`)
            try {
                await next();
            } catch (err) {
                logger.error(`请求出错`, err, 'all')
            } finally {
                const endTime = Date.now()
                logger.info(`处理完成 耗时 ${(endTime - startTime) / 1000}s`)
            }
        })
    }
};
