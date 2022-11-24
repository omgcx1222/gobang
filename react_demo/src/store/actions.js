import socket from "../socket"
import { LOGIN, JOIN_GAME, CREATE_PIECE, PLAYER_MESSAGE } from "../socket/types"

export const loginAction = (name) => {
  return () => {
    socket.sendMessage({ type: LOGIN, name })
  }
}

// 0-白子 1-黑子
export const joinGameAction = (type) => {
  return () => {
    socket.sendMessage({ type: JOIN_GAME, joinType: type })
  }
}

// 落子
export const createPieceAction = (x, y) => {
  return () => {
    socket.sendMessage({ type: CREATE_PIECE, xy: { x, y } })
  }
}

export const sendMsgAction = (msg) => {
  return () => {
    socket.sendMessage({ type: PLAYER_MESSAGE, msg })
  }
}