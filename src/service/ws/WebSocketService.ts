import { Service } from '@spring4js/container-node'
import http from 'http'
import WebSocket from 'ws'
import log4js from "log4js";

const logger = log4js.getLogger("WebSocketService");
@Service()
export default class WebSocketService {

    setHttpServer(httpServer: http.Server) {
        const wss =  new WebSocket.Server({
            server: httpServer,
            maxPayload: 100 * 1024 * 1024, // 100M
            skipUTF8Validation: true
            // perMessageDeflate: {
            //   threshold: 1024
            // }
        })
         wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
            logger.info('连接建立')
            ws.on('message', (data: WebSocket.Data) => {
                const obj: any = JSON.parse(data.toString('utf8'))
                console.log(obj)
            })
         })
    }
}