import { LOGIN, SYSTEM_MESSAGE, PLAYER_MESSAGE, CHANGE_GAME_INFO, CREATE_PIECE, REMARK } from "../socket/types"

const initialState = {
  connect: 0,
  msgList: [],
  name: "",
  gameInfo: {}, // {white: "",black: ""}
  mapXY: []
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return { ...state, connect: 1, name: payload.name, mapXY: payload.mapXY }

    case SYSTEM_MESSAGE:
      return { ...state, msgList: [...state.msgList, { msg: payload.msg, type: SYSTEM_MESSAGE }] }

    case PLAYER_MESSAGE:
      return { ...state, msgList: [...state.msgList, { msg: payload.msg, type: PLAYER_MESSAGE, name: payload.name }] }

    case CHANGE_GAME_INFO:
      return { ...state, gameInfo: payload }

    case CREATE_PIECE:
      return { ...state, mapXY: [...state.mapXY, payload] }

    case REMARK:
      return { ...state, gameInfo: { white: "", black: "" }, mapXY: [] }

    default:
      return state
  }
}

export default reducer
