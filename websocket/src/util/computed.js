const { SIZE } = require("../gameConfig")

/**
 * 计算是否五子相连
 */

// 全部白子和黑子坐标(除去最后一次) allXY = [{ x, y }, { x, y }]
// 落子坐标(最后一次) xy = { x: 150, y: 150 };
// 落子类型 0-白子 1-黑子
const computed = (allXY, xy, type) => {
  const all = [[], [], [], []];   // 落子为中心，半径为4子以内的“正方形”
  const offset = SIZE * 4;   // 除去本身4子相连

  for (const i in allXY) {
    if (i % 2 !== type) continue

    // 落子为中心，半径为4子以内的“正方形”
    if ((allXY[i].x <= xy.x + offset || allXY[i].x >= xy.x - offset) && (allXY[i].y <= xy.y + offset || allXY[i].y >= xy.y - offset)) {
      if (allXY[i].x === xy.x) {
        all[0].push([allXY[i].x, allXY[i].y]);
      } else if (allXY[i].x - xy.x == allXY[i].y - xy.y) {
        all[1].push([allXY[i].x, allXY[i].y]);
      } else if (allXY[i].y == xy.y) {
        all[2].push([allXY[i].x, allXY[i].y]);
      } else if (allXY[i].x - xy.x == -(allXY[i].y - xy.y)) {
        all[3].push([allXY[i].x, allXY[i].y]);
      }
    }
  }

  // console.log(allXY, all);

  const res = all.find((item, index) => {
    if (item.length < 4) return false;
    let count = 1;
    let next1 = 1;
    let next2 = 1;

    while (next1) {
      let exist = false
      switch (index) {
        case 0:
          exist = item.find((item2) => item2[1] === xy.y + next1 * SIZE);
          break;
        case 1:
          exist = item.find((item2) => item2[1] === xy.y + next1 * SIZE && item2[0] === xy.x + next1 * SIZE);
          break;
        case 2:
          exist = item.find((item2) => item2[0] === xy.x + next1 * SIZE);
          break;
        case 3:
          exist = item.find((item2) => item2[1] === xy.y + next1 * SIZE && item2[0] === xy.x - next1 * SIZE);
          break;

        default:
          break;
      }
      if (exist && count < 5) {
        count++;
        next1++;
      } else {
        next1 = false;
      }
    }
    while (next2) {
      let exist = false
      switch (index) {
        case 0:
          exist = item.find((item2) => item2[1] === xy.y - next2 * SIZE);
          break;
        case 1:
          exist = item.find((item2) => item2[1] === xy.y - next2 * SIZE && item2[0] === xy.x - next2 * SIZE);
          break;
        case 2:
          exist = item.find((item2) => item2[0] === xy.x - next2 * SIZE);
          break;
        case 3:
          exist = item.find((item2) => item2[1] === xy.y - next2 * SIZE && item2[0] === xy.x + next2 * SIZE);
          break;

        default:
          break;
      }
      if (exist && count < 5) {
        count++;
        next2++;
      } else {
        next2 = false;
      }
    }
    return count >= 5;
  });

  // 返回相连落子的坐标数组
  return res
}

module.exports = {
  computed
}




