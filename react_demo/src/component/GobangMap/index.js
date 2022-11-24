import React, { memo, useEffect, useRef, useState, useCallback } from 'react';

import gameConfig from "../../gameConfig"

import style from "./style.module.css"

const GobangMap = memo((props) => {
  const { clickMap, mapXY } = props
  const canvasRef = useRef();
  const [ctx, setCtx] = useState(null);
  const [currentXY, setCurrentXY] = useState({});

  const renderMap = useCallback(() => {
    if (ctx?.canvas) {
      console.log("棋盘重新渲染");
      const gridSize = gameConfig.SIZE;
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      const row = Math.floor(canvasWidth / gridSize);
      // const col = Math.floor(canvasWidth / gridSize);
      for (let i = 0; i < row; i++) {
        ctx.moveTo(50, i * gridSize - 0.5);
        ctx.lineTo(canvasWidth - 50, i * gridSize - 0.5);

        ctx.moveTo(i * gridSize - 0.5, 50);
        ctx.lineTo(i * gridSize - 0.5, canvasHeight - 50);
        ctx.stroke();
      }
    }
  }, [ctx])

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    setCtx(ctx);
    ctx.strokeStyle = '#000';
    renderMap()
  }, [renderMap]);

  const createPiece = useCallback(
    (x, y, color = '#000', borderColor) => {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      // if (borderColor) {
      //   ctx.font = "20px Arial"
      //   ctx.fillStyle = "red"
      //   ctx.textAlign = "center"
      //   ctx.fillText("11", ctx.canvas.width / 2, ctx.canvas.height / 2)
      // }
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
      setCurrentXY({ x, y })
    },
    [ctx]
  )

  // 清空所有棋子
  // const clearAllPiece = useCallback(() => {
  //   ctx.height = gameConfig.HEIGHT + 1
  // }, [ctx])

  useEffect(() => {
    if (mapXY.length === 0 && ctx?.canvas) {
      ctx.canvas.height = ctx.canvas.height - 1
      ctx.canvas.height = ctx.canvas.height + 1
      return renderMap()
    }
    mapXY.forEach(({ x, y }, index) => {
      if (index % 2 === 0) {
        return createPiece(x, y, '#fff', (index === mapXY.length - 1 ? '#000' : ''))
      }
      createPiece(x, y, '#000', (index === mapXY.length - 1 ? '#fff' : ''))
    })
  }, [mapXY, createPiece, renderMap, ctx])

  return (
    <div style={{ position: "relative" }}>
      <div className={style.map} onClick={(e) => clickMap(e)}>
        <canvas ref={canvasRef} width={gameConfig.WIDTH} height={gameConfig.HEIGHT}>浏览器不支持</canvas>
      </div>
      {
        mapXY.length > 0 ?
          <div className={style.current}
            style={{
              width: gameConfig.SIZE + "px",
              height: gameConfig.SIZE + "px",
              lineHeight: gameConfig.SIZE + "px",
              top: currentXY.y + "px",
              left: currentXY.x + "px",
              color: mapXY.length % 2 === 0 ? '#fff' : '#000'
            }}>{mapXY.length}
          </div> : <></>
      }
    </div>
  );
});

export default GobangMap;
