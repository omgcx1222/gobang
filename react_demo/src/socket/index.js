import { LOGIN, SYSTEM_MESSAGE, JOIN_GAME, CHANGE_GAME_INFO, CREATE_PIECE, REMARK, PLAYER_MESSAGE } from "./types";
import store from "../store"

class Socket {
  constructor(url) {
    this.socket = new WebSocket(url)

    this.socket.onerror = (e) => {
      alert("服务器连接失败")
    }

    this.socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data)

      switch (data.type) {
        case LOGIN:
          if (data.state !== 200) {
            return alert(data.msg)
          }
          store.dispatch({ type: LOGIN, payload: data.data })
          break;

        case SYSTEM_MESSAGE:
          store.dispatch({ type: SYSTEM_MESSAGE, payload: { msg: data.msg } })
          break;

        case PLAYER_MESSAGE:
          store.dispatch({ type: PLAYER_MESSAGE, payload: { msg: data.msg, name: data.name } })
          break;

        case JOIN_GAME:
          alert(data.msg)
          break;

        case CHANGE_GAME_INFO:
          store.dispatch({ type: CHANGE_GAME_INFO, payload: data.data })
          break;

        case CREATE_PIECE:
          if (data.state !== 200) {
            return alert(data.msg)
          }
          store.dispatch({ type: CREATE_PIECE, payload: data.data })
          break;

        case REMARK:
          store.dispatch({ type: SYSTEM_MESSAGE, payload: { msg: "对局将在3秒后重置" } })
          setTimeout(() => {
            store.dispatch({ type: REMARK })
          }, 3000)
          break;

        default:
          break;
      }
    }
  }

  onMessage (callback) {
    this.callback = callback
  }
  close () {
    this.socket.close()
  }
  sendMessage (data = {}) {
    if (this.socket.readyState !== 1) return alert("服务器连接失败，请稍后刷新页面重试")
    this.socket.send(JSON.stringify(data))
  }
}

const socket = new Socket("ws://s7upet.natappfree.cc/socket")
export default socket