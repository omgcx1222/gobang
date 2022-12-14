const KoaRouter = require('koa-router')
const { LOGIN, OFFLINE, JOIN_GAME, CREATE_PIECE, PLAYER_MESSAGE } = require('./socket-type')
const { offline, login, joinGame, createPiece, playerMsg } = require('./typeFn')

const socketRouter = new KoaRouter()

socketRouter.get('/socket', async (ctx) => {

  ctx.websocket.on('message', message => {
    const data = JSON.parse(message)
    // console.log(data, 'data');

    switch (data.type) {
      case LOGIN:
        login(ctx, data)
        break;

      case OFFLINE:
        offline(ctx, data)
        break;

      case JOIN_GAME:
        joinGame(ctx, data)
        break;

      case CREATE_PIECE:
        createPiece(ctx, data)
        break;

      case PLAYER_MESSAGE:
        playerMsg(ctx, data)
        break;

      default:
        break;
    }
  })

  ctx.websocket.on('close', state => {
    offline(ctx)
  })
})


module.exports = socketRouter