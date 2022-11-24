const Koa = require('koa')
const webSocket = require('koa-websocket')
const cors = require('@koa/cors')
const KoaStatic = require('koa-static');

// const bodyparser = require('koa-bodyparser')

const socketRouter = require('./router/socketRouter')

const app = webSocket(new Koa())

app.use(cors())


// app.use(bodyparser())
app.ws.use(socketRouter.routes())

app.proxy = true
app.use(KoaStatic('./dist'))

const PORT = 8083
app.listen(PORT, () => {
  console.log(`服务器启动成功，端口 ${PORT}`);
})