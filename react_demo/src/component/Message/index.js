import React, { memo, useEffect, useRef, useState } from 'react'

import { SYSTEM_MESSAGE } from "../../socket/types"

import style from "./style.module.css"

const Message = memo((props) => {
  const { msgList, clickSend } = props
  const [msg, setMsg] = useState("")
  const listRef = useRef()

  const sendMsg = (msg) => {
    if (msg.length <= 0 || msg.length >= 80) return alert("消息违规")
    clickSend(msg)
    setMsg("")
  }

  const keyUp = (e) => {
    if (e.keyCode === 13) {
      sendMsg(msg)
    }
  }

  useEffect(() => {
    if (listRef.current.offsetHeight < listRef.current.scrollHeight) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [msgList])

  return (
    <div className={style.msg}>
      <div className={style.list} ref={listRef}>
        {
          msgList.map((item, index) => (
            <div key={index} style={{ wordBreak: "break-all" }}>
              {
                item.type === SYSTEM_MESSAGE ? <span style={{ color: "#eb7f00" }}>{'【系统消息】: ' + item.msg}</span> : <span>{`【玩家 ${item.name}】: ${item.msg}`}</span>
              }
            </div>
          ))
        }
      </div>
      <div className={style.send}>
        <input type="text" value={msg} placeholder="长度1-80个字符串" onInput={e => setMsg(e.target.value)} onKeyUp={e => keyUp(e)} />
        <button onClick={() => sendMsg(msg)}>发送</button>
      </div>
    </div>
  )
})

export default Message