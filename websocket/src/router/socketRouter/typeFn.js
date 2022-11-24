const { LOGIN, SYSTEM_MESSAGE, PLAYER_MESSAGE, JOIN_GAME, CHANGE_GAME_INFO, CREATE_PIECE, REMARK } = require("./socket-type")
const { SIZE, WIDTH } = require("../../gameConfig")
const { computed } = require("../../util/computed")

/**
 * 在线列表 {name, roomId}
 */
const playerList = []

const gameInfo = {
  white: "",
  black: ""
}
// [{x, y}]
let mapXY = []

// 给自己发送
function sendSelf (ctx, data) {
  ctx.websocket.send(JSON.stringify(data))
}

// 给所有人发送
function sendAll (data) {
  playerList.forEach(item => {
    item.websocket.send(JSON.stringify(data))
  })
}

function offline (ctx) {
  playerList.find((item, index) => {
    if (item.name === ctx.name) {
      playerList.splice(index, 1)
      return true
    }
  })
  if (gameInfo.white === ctx.name) gameInfo.white = ""
  if (gameInfo.black === ctx.name) gameInfo.black = ""

  sendAll({ type: CHANGE_GAME_INFO, data: gameInfo, state: 200 })
  sendAll({ type: SYSTEM_MESSAGE, msg: `${ctx.name} 下线`, data: playerList.length, state: 200 })
}

function login (ctx, data) {
  if (typeof data.name === "string" && 0 < data.name.length && data.name.length <= 16) {
    const exist = playerList.find(item => item.name == data.name)
    if (exist) {
      return sendSelf(ctx, { type: LOGIN, msg: "登录失败！该昵称已存在", state: 201 })
    }
    ctx.name = data.name
    playerList.push(ctx)
    sendSelf(ctx, { type: LOGIN, msg: "登录成功！", data: { online: playerList.length, name: ctx.name, mapXY }, state: 200 })
    sendSelf(ctx, { type: CHANGE_GAME_INFO, data: gameInfo, state: 200 })
    sendAll({ type: SYSTEM_MESSAGE, msg: `${data.name} 上线`, data: playerList.length, state: 200 })
  } else {
    sendSelf(ctx, { type: LOGIN, msg: "登录失败！请不要输入非法昵称！", state: 400 })
  }
}

// { joinType: 0-白子，1-黑子 }
function joinGame (ctx, data) {
  if (!ctx.name) return

  if (ctx.name === gameInfo.white || ctx.name === gameInfo.black) {
    return sendSelf(ctx, { type: JOIN_GAME, msg: "已经是白子或黑子玩家！", state: 201 })
  }

  if (data.joinType === 0) {
    if (gameInfo.white) {
      return sendSelf(ctx, { type: JOIN_GAME, msg: "白子玩家已存在", state: 201 })
    }
    gameInfo.white = ctx.name
    sendSelf(ctx, { type: JOIN_GAME, msg: "加入白子，开始对弈", state: 200 })
    sendAll({ type: SYSTEM_MESSAGE, msg: `${ctx.name} 加入白子`, state: 200 })
    sendAll({ type: CHANGE_GAME_INFO, data: gameInfo, state: 200 })
  } else if (data.joinType === 1) {
    if (gameInfo.black) {
      return sendSelf(ctx, { type: JOIN_GAME, msg: "黑子玩家已存在", state: 201 })
    }
    gameInfo.black = ctx.name
    sendSelf(ctx, { type: JOIN_GAME, msg: "加入黑子，开始对弈", state: 200 })
    sendAll({ type: SYSTEM_MESSAGE, msg: `${ctx.name} 加入黑子`, state: 200 })
    sendAll({ type: CHANGE_GAME_INFO, data: gameInfo, state: 200 })
  }
}

// 落子 xy坐标
function createPiece (ctx, data) {
  if (!ctx.name) return
  // 0-白子，1-黑子
  const pipieceType = ctx.name === gameInfo.white ? 0 : ctx.name === gameInfo.black ? 1 : null
  if (pipieceType === null) return sendSelf(ctx, { type: CREATE_PIECE, msg: "你不是白子或黑子玩家", state: 201 })

  if (mapXY.length % 2 !== pipieceType) return sendSelf(ctx, { type: CREATE_PIECE, msg: "未到你下", state: 201 })

  let { x = -1, y = -1 } = data.xy
  x = (x / SIZE).toFixed() * SIZE
  y = (y / SIZE).toFixed() * SIZE
  if (SIZE <= x && x <= WIDTH - SIZE && SIZE <= y && y <= WIDTH - SIZE) {
    const exist = mapXY.find(item => item.x === x && item.y === y)
    if (exist) {
      return sendSelf(ctx, { type: CREATE_PIECE, msg: "该位置已下棋子", state: 201 })
    }

    sendAll({ type: CREATE_PIECE, data: { x, y }, state: 200 })

    const res = computed(mapXY, { x, y }, pipieceType)
    if (res) {
      sendAll({ type: SYSTEM_MESSAGE, msg: `游戏结束，${ctx.name} 获胜！`, state: 200 })
      sendAll({ type: REMARK, msg: '游戏将重置！', state: 200 })
      return remark()
    }

    mapXY.push({ x, y })
  }
}

// 重置
function remark () {
  gameInfo.white = ""
  gameInfo.black = ""
  mapXY = []
}

// 玩家发送消息
function playerMsg (ctx, data) {
  if (!ctx.name) return
  const { msg = "" } = data
  if (msg && msg.length <= 80) {
    return sendAll({ type: PLAYER_MESSAGE, msg, state: 200, name: ctx.name })
  }
  sendAll({ type: PLAYER_MESSAGE, msg: "消息违规！", state: 201 })
}

module.exports = {
  login,
  offline,
  joinGame,
  createPiece,
  playerMsg
}