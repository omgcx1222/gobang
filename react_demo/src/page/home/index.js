import React, { memo, useCallback, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from "react-redux"

import { loginAction, joinGameAction, createPieceAction, sendMsgAction } from '../../store/actions'

import GobangMap from '../../component/GobangMap';
import Message from '../../component/Message';
import style from "./style.module.css"

const Home = memo(() => {
  const [inputName, setInputName] = useState("")
  const { connect, msgList, name, gameInfo, mapXY } = useSelector((store) => {
    return {
      connect: store.connect,
      msgList: store.msgList,
      name: store.name,
      gameInfo: store.gameInfo,
      mapXY: store.mapXY
    }
  }, shallowEqual)
  const dispatch = useDispatch()

  // useEffect(() => {
  //   return () => {
  //     dispatch(offLine)
  //   }
  // }, [dispatch])

  const login = () => {
    dispatch(loginAction(inputName))
  }

  const joinGame = (type) => {
    dispatch(joinGameAction(type))
  }

  const clickMap = useCallback(
    (e) => {
      dispatch(createPieceAction(e.nativeEvent.offsetX, e.nativeEvent.offsetY))
    },
    [dispatch]
  )

  const sendMsg = useCallback(
    (msg) => {
      dispatch(sendMsgAction(msg))
    },
    [dispatch]
  )

  return (
    <div className={style.home}>
      <div className={style.login} style={{ display: connect === 1 ? "none" : "block" }}>
        <div className={style['login-box']}>
          <input type="text" placeholder='请输入昵称(长度1-16)' onInput={(e) => setInputName(e.target.value)} />
          <button onClick={login}>进入</button>
        </div>
      </div>

      <div style={{ display: connect === 1 ? "block" : "none" }}>
        <div className={style['room-header']}>
          <h2>五子棋&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;昵称：{name} {gameInfo.white === name ? '(白子玩家)' : gameInfo.black === name ? '(黑子玩家)' : '(正在观战)'}</h2>
        </div>
        <div className={style.box}>
          <GobangMap clickMap={clickMap} mapXY={mapXY} />
          <div className={style.btn}>
            <div style={{ marginBottom: "50px" }}>
              <span className={style.current}>{mapXY.length % 2 === 0 ? '→' : ''} </span>
              <div className={style.text}>白子玩家：{gameInfo.white || '无'}</div>
              <button style={{ display: gameInfo.white ? 'none' : 'block' }} onClick={() => joinGame(0)}>加入白子</button>
            </div>
            <div>
              <span className={style.current}>{mapXY.length % 2 === 0 ? '' : '→'} </span>
              <div className={style.text}>黑子玩家：{gameInfo.black || '无'}</div>
              <button style={{ display: gameInfo.black ? 'none' : 'block' }} onClick={() => joinGame(1)}>加入黑子</button>
            </div>
          </div>
          <Message msgList={msgList} clickSend={sendMsg} />
        </div>
      </div>
    </div>
  )
})

export default Home