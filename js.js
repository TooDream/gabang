var chess = document.getElementsByClassName("chess")[0];
let title = document.getElementsByTagName("h3")[0];
let retreat = document.getElementsByClassName("retreat")[0];
let cancelBack = document.getElementsByClassName("cancelBack")[0];
let blackStatus = document.getElementById("blackStatus");
let redStatus = document.getElementById("redStatus");
var context = chess.getContext("2d");
context.strokeStyle = "#B9B9B9";
window.onload = function () {
  drawChessBoard();
};
// 绘制棋盘
function drawChessBoard() {
  for (let i = 0; i < 15; i++) {
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();

    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
  }
}

// 设置赢法数组
var wins = [];
for (let i = 0; i < 15; i++) {
  wins[i] = [];
  for (let j = 0; j < 15; j++) {
    wins[i][j] = [];
  }
}

// 算法的编号
var count = 0;
// 与文章的理解有出入！！！
// 统计竖线算法
for (let i = 0; i < 15; i++) {
  for (let j = 0; j < 11; j++) {
    for (let k = 0; k < 5; k++) {
      wins[j + k][i][count] = true;
    }
    count++;
  }
}

// 统计横线算法
for (let i = 0; i < 15; i++) {
  for (let j = 0; j < 11; j++) {
    for (let k = 0; k < 5; k++) {
      wins[i][j + k][count] = true;
    }
    count++;
  }
}

// 统计正斜线算法
for (let i = 0; i < 11; i++) {
  for (let j = 0; j < 11; j++) {
    for (let k = 0; k < 5; k++) {
      wins[i + k][j + k][count] = true;
    }
    count++;
  }
}

// 统计反斜线算法
for (let i = 0; i < 11; i++) {
  for (let j = 14; j > 3; j--) {
    for (let k = 0; k < 5; k++) {
      wins[i + k][j - k][count] = true;
    }
    count++;
  }
}

// 定义二维数组标记棋盘上每个坐标是否已落子
var chessboard = [];
for (let i = 0; i < 15; i++) {
  chessboard[i] = [];
  for (let j = 0; j < 15; j++) {
    chessboard[i][j] = 0;
  }
}

// 下棋
var over = false;

// 添充数组，避免下面++时识别为NaN不能操作
let myWin = [];
let blackWin = [];
let redWin = [];

blackWin.length = count;
blackWin.fill(0);

redWin.length = count;
redWin.fill(0);
// for(var k=0;k < count;k++){
//   myWin[k] = 0
// }

// 保存快照数组
let canvasHistory = [];

//当前棋手初始为黑方
let chessPlayer = "black";

//
let step = -1;

// 记录棋子个数以及每个棋子的坐标
let qiziCount = [];
// 记录悔棋的步数
let retreatStepCount = 0;
// 记录数组K的
let kRecord = [];

chess.onclick = function (e) {
  if (over) return;

  // 获取坐标
  var x = e.offsetX;
  var y = e.offsetY;

  // 计算棋子中心点，中心点也是chessboard是否有子的凭证
  var i = Math.floor(x / 30);
  var j = Math.floor(y / 30);

  if (chessboard[i][j] == 0) {
    if (chessPlayer == "black") {
      //下子
      oneStep(i, j, chessPlayer);
      //标记已经落子
      chessboard[i][j] = 1;
      qiziCount.push([i, j]);
      console.log(qiziCount);

      // 改变下步下棋的角色
      chessPlayer = "red";

      for (var k = 0; k < count; k++) {
        if (wins[i][j][k]) {
          blackWin[k]++;
          console.log("k++");
          kRecord.push(k);
          // console.log(count);
          if (blackWin[k] == 5) {
            title.innerText = "黑色方获胜了！";
            over = true;
            return;
          }
        }
      }
      redStatus.style.display = "block";
      blackStatus.style.display = "none";
    } else {
      //下子
      oneStep(i, j, chessPlayer);
      //标记已经落子
      chessboard[i][j] = 1;
      qiziCount.push([i, j]);

      // 改变下步下棋的角色
      chessPlayer = "black";

      for (var k = 0; k < count; k++) {
        if (wins[i][j][k]) {
          redWin[k]++;
          if (redWin[k] == 5) {
            title.innerText = "红色方获胜了！";
            over = true;
            return;
          }
        }
      }

      blackStatus.style.display = "block";
      redStatus.style.display = "none";
    }
  }
};

// 落子方法
function oneStep(i, j, chessPlayer) {
  //起笔
  context.beginPath();

  // 参数1、2为画圆位置,13为半径，0为圆心
  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);

  //落笔
  context.closePath();

  var color;
  if (chessPlayer == "black") {
    color = "#000000";
  } else {
    color = "red";
  }

  context.fillStyle = color;
  context.fill();

  step++;
  if (step < canvasHistory.length) {
    console.log("截断");
    canvasHistory.length = step; // 截断数组
  }

  canvasHistory.push(chess.toDataURL());
}

// 悔棋
// 黑方悔棋
retreat.addEventListener("click", function () {
  if (chessPlayer == "black") {
    // 在黑方自己方的回合去悔棋，后退两步
    if (step >= 1) {
      step = step - 1;

      context.clearRect(0, 0, 3000, 3000);
      let canvasPic = new Image();
      canvasPic.src = canvasHistory[step];
      canvasPic.addEventListener("load", () => {
        context.drawImage(canvasPic, 0, 0);
      });

      // 获得需要悔棋的坐标值
      // let retreatItem = qiziCount[qiziCount.length - 1];
      let retreatItem = qiziCount[qiziCount.length - retreatStepCount - 1];
      retreatStepCount++;
      chessboard[retreatItem[0]][retreatItem[1]] = 0;
      for (var k = 0; k < count; k++) {
        if (wins[retreatItem[0]][retreatItem[1]][k] && redWin[k] !== 0) {
          // 黑方下子时悔棋则需要将红色方上一步的所有匹配情况--
          redWin[k]--;
        }
      }
      chessPlayer = "red";
      redStatus.style.display = "block";
      blackStatus.style.display = "none";
    } else {
      console.log("不能再继续撤销了");
    }
  } else if (chessPlayer == "red") {
    // 在红方的回合去悔棋，只后退一步
    if (step >= 1) {
      step = step - 1;

      context.clearRect(0, 0, 3000, 3000);
      let canvasPic = new Image();
      canvasPic.src = canvasHistory[step];
      canvasPic.addEventListener("load", () => {
        context.drawImage(canvasPic, 0, 0);
      });

      // 获得需要悔棋的坐标值
      // let retreatItem = qiziCount[qiziCount.length - 1];
      let retreatItem = qiziCount[qiziCount.length - retreatStepCount - 1];
      retreatStepCount++;
      chessboard[retreatItem[0]][retreatItem[1]] = 0;
      for (var k = 0; k < count; k++) {
        if (wins[retreatItem[0]][retreatItem[1]][k] && blackWin[k] !== 0) {
          // 红方下子时悔棋则需要将黑色方上一步的所有匹配情况--
          blackWin[k]--;
        }
      }
      chessPlayer = "black";
      redStatus.style.display = "none";
      blackStatus.style.display = "block";
    } else {
      console.log("不能再继续撤销了");
    }
  }
});

cancelBack.addEventListener("click", function () {
  if (chessPlayer == "black") {
    if (step < canvasHistory.length - 1) {
      step++;
      let canvasPic = new Image();
      canvasPic.src = canvasHistory[step];
      canvasPic.addEventListener("load", () => {
        context.clearRect(0, 0, 30, 30);
        context.drawImage(canvasPic, 0, 0);
      });
      // let retreatItem = qiziCount[qiziCount.length - 1];
      let retreatItem = qiziCount[qiziCount.length - retreatStepCount - 1];
      retreatStepCount--;
      chessboard[retreatItem[0]][retreatItem[1]] = 1;
      for (var k = 0; k < count; k++) {
        if (wins[retreatItem[0]][retreatItem[1]][k]) {
          // 红黑方下子时撤销悔棋则需要将红色方上一步的所有匹配情况++
          redWin[k]++;
        }
      }

      // 换身份下棋
      chessPlayer = chessPlayer == "red" ? "black" : "red";
      if (chessPlayer == "red") {
        redStatus.style.display = "block";
        blackStatus.style.display = "none";
      } else {
        redStatus.style.display = "none";
        blackStatus.style.display = "block";
      }
    } else {
      console.log("已经是最新的记录了");
    }
  } else {
    if (step < canvasHistory.length - 1) {
      step++;
      let canvasPic = new Image();
      canvasPic.src = canvasHistory[step];
      canvasPic.addEventListener("load", () => {
        context.clearRect(0, 0, 30, 30);
        context.drawImage(canvasPic, 0, 0);
      });
      // let retreatItem = qiziCount[qiziCount.length - 1];
      let retreatItem = qiziCount[qiziCount.length - retreatStepCount - 1];
      retreatStepCount--;
      chessboard[retreatItem[0]][retreatItem[1]] = 1;
      for (var k = 0; k < count; k++) {
        if (wins[retreatItem[0]][retreatItem[1]][k]) {
          // 红方下子时撤销悔棋则需要将黑色方上一步的所有匹配情况++
          blackWin[k]++;
        }
      }

      // 换身份下棋
      chessPlayer = chessPlayer == "black" ? "red" : "black";
      if (chessPlayer == "red") {
        redStatus.style.display = "block";
        blackStatus.style.display = "none";
      } else {
        redStatus.style.display = "none";
        blackStatus.style.display = "block";
      }
    } else {
      console.log("已经是最新的记录了");
    }
  }
});
