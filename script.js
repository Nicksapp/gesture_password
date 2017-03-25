var R = 26,  // 圆形触点半径
    clientWidth = 400, // 画布宽度
    clientHeight = 500, // 画布高度
    offsetX = 55,  // 左右x边距
    offsetY = 120; // 上下y边距

var PointLocationArr = [];
var Alert_info = document.getElementById("alert");
var Reset_password = document.getElementById("reset_password");
var Verify_password = document.getElementById("verify_password");

window.onload = function () {
  var canvas = document.getElementById('gesture_password');
  var context = canvas.getContext('2d');
  canvas.addEventListener('mousemove', onMouseMove, false);
  var XY_info = document.getElementById('XY_info');  // 显示实时坐标

  clientWidth = document.body.offsetWidth;
  canvas.width = clientWidth;  // 画布宽度根据浏览器大小自动适配
  canvas.height = clientHeight;

  // 计算两个圆之间的外边距
  var outsideX = (clientWidth - 2 * offsetX - R * 2 * 3) / 2;
  var outsideY = (clientHeight - 2 * offsetY - R * 2* 3) / 2;

  PointLocationArr = CaculateNinePointLocation(outsideX, outsideY);

  Reset_password.addEventListener("click", function (e) {
    Alert_info.innerHTML = "设置密码";
    removeSecret();
    setupLinePoint(canvas, context); // 事件监听
  });

  Verify_password.addEventListener("click", function (e) {
    Alert_info.innerHTML = "验证密码";
    verifyLinePoint(canvas, context);
  });

  DrawCircle(canvas, context, PointLocationArr, [], null); // 图形绘制

};

function onMouseMove (event) {
  var e = event || window.event;
  XY_info.firstChild.nodeValue = ' x: ' + e.layerX + ' y: ' + e.layerY;
}

// 获得九个圆形触点的坐标 参数为 X:Y 外边距
function CaculateNinePointLocation(outsideX, outsideY) {
  var point_arr = [];
  for (var row = 0; row < 3; row++) {
    for (var col = 0;col < 3; col++) {
      var Location = {
        X: (offsetX + col * outsideX + (col * 2 + 1) * R),
        Y: (offsetY + row * outsideY + (row * 2 + 1) * R)
      };
      point_arr.push(Location);
    }
  }
  return point_arr;
}

function DrawCircle (canvas, context, PointLocationArr, LinePointArr, touchPoint) {

  context.fillStyle = "#f8f8f8";
  context.fillRect(0, 0, canvas.width, 70);
  context.font = "25px 黑体";
  context.fillStyle = "#000000";
  context.textAlign = "center";
  context.fillText("手势密码", canvas.width/2, 50);   // 绘制实线文字,Header水平居中文字
  context.beginPath();
  context.moveTo(0, 70);
  context.lineTo(canvas.width, 70);
  context.lineWidth = 2;
  context.strokeStyle = "#cacaca";
  context.stroke();
  context.closePath();

  if (LinePointArr.length > 0) {  // 手势连线的根据编号的绘制
    context.beginPath();
    for (var i = 0; i < LinePointArr.length; i++) {
      var pointIndex = LinePointArr[i];
      context.lineTo(PointLocationArr[pointIndex].X, PointLocationArr[pointIndex].Y); // 没有moveTo起点的lineTo自动以上一个点为起始点
    }
    context.lineWidth = 10; // 手势连线的线宽
    context.strokeStyle = "#fe5c5d"; // 手势连线的颜色
    context.stroke();
    context.closePath();
    if (touchPoint != null) {
      var lastPointIndex = LinePointArr[LinePointArr.length - 1];
      var lastPoint = PointLocationArr[lastPointIndex];
      context.beginPath();
      context.moveTo(lastPoint.X, lastPoint.Y);
      context.lineTo(touchPoint.X, touchPoint.Y);
      context.stroke();
      context.closePath();
    }
  }
  for (var j = 0;j < PointLocationArr.length; j++) { // 绘制9个触摸圆点
    var Point = PointLocationArr[j];
    context.fillStyle = "#fe5c5d"; // 圆点填充颜色
    context.beginPath();
    context.arc(Point.X, Point.Y, R, 0, Math.PI*2, true);
    context.closePath();
    context.fill();
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(Point.X, Point.Y, R - 3, 0, Math.PI*2, true);
    context.closePath();
    context.fill();
    if (LinePointArr.indexOf(j) >= 0) {
      context.fillStyle = "#fe5c5d";
      context.beginPath();
      context.arc(Point.X, Point.Y, R - 16, 0, Math.PI*2, true);
      context.closePath();
      context.fill();
    }
  }
}

// 当前屏幕上所有手指的列表,连线的编号数组
function IsPointSelected(touches, LinePoint) {
  for (var i = 0;i < PointLocationArr.length; i++) {
    var currentPoint = PointLocationArr[i];
    var x = Math.abs(currentPoint.X - touches.pageX);
    var y = Math.abs(currentPoint.Y - touches.pageY);
    var dir = Math.pow((x * x + y * y), 0.5);
    if (dir < R) {
      if (LinePoint.indexOf(i) < 0) {
        LinePoint.push(i);
      }
      break;
    }
  }
}


// 设置手势密码
function setupLinePoint (canvasContainer, context) {
  var LinePoint = [];
  canvasContainer.addEventListener("touchstart", function(e) {
    var event = e || window.event;
    IsPointSelected(event.targetTouches[0], LinePoint);
  }, false);
  canvasContainer.addEventListener("touchmove", function (e) {
    var event = e || window.event;
    event.preventDefault();
    var touches = event.targetTouches[0];  // 当前屏幕上所有手指的列表
    IsPointSelected(touches, LinePoint);
    context.clearRect(0, 0, clientWidth, clientHeight);
    DrawCircle(canvasContainer, context, PointLocationArr, LinePoint, {X:touches.pageX, Y:touches.pageY});
  }, false);
  canvasContainer.addEventListener("touchend", function (e){
    context.clearRect(0, 0, clientWidth, clientHeight);
    DrawCircle(canvasContainer, context, PointLocationArr, LinePoint, null);
    Alert_info.innerHTML = `密码是: ${LinePoint.join("->")}`;
    saveLinePoint(LinePoint);
    LinePoint = [];
  }, false);
}
// 清除密码
function removeSecret() {
  if (!window.localStorage) {
    alert("你的浏览器不支持localStorage");
    return false;
  } else {
    window.localStorage.clear();
  }
}

// 设置密码
function saveLinePoint (LinePoint) {
  if (!window.localStorage) {
    alert("你的浏览器不支持localStorage");
    return false;
  } else {
    var storage = window.localStorage;
    if (!storage.getItem("secret_first") ) {
      if (LinePoint.length < 5) {
        Alert_info.innerHTML = "密码太短,至少需要5个点!";
      } else {
        storage.setItem("secret_first", LinePoint);
        console.log(storage);
        Alert_info.innerHTML = "请重复输入确认你的手势密码!";
      }
    } else {
      storage.setItem("secret_repeat", LinePoint);
      if (storage.getItem("secret_first") === storage.getItem("secret_repeat")) {
        storage.setItem("secret", LinePoint);

        Alert_info.innerHTML = "手势密码设置成功!";
        console.log("saved gesture password successfully");
        console.log(storage);
        return false;
      } else {
        Alert_info.innerHTML = "两次手势密码输入不一致,请重新设置!";
        console.log("两次手势密码输入不一致,请重新设置!")
        storage.removeItem("secret_first");
        storage.removeItem("secret_repeat");
      }
    }
  }
}


// 密码验证函数
function verifyLinePoint (canvasContainer, context) {
  var LinePoint = [];
  canvasContainer.addEventListener("touchstart", function(e) {
    var event = e || window.event;
    IsPointSelected(event.targetTouches[0], LinePoint);
  }, false);
  canvasContainer.addEventListener("touchmove", function (e) {
    var event = e || window.event;
    event.preventDefault();
    var touches = event.targetTouches[0];  // 当前屏幕上所有手指的列表
    IsPointSelected(touches, LinePoint);
    context.clearRect(0, 0, clientWidth, clientHeight);
    DrawCircle(canvasContainer, context, PointLocationArr, LinePoint, {X:touches.pageX, Y:touches.pageY});
  }, false);
  canvasContainer.addEventListener("touchend", function (e){
    context.clearRect(0, 0, clientWidth, clientHeight);
    DrawCircle(canvasContainer, context, PointLocationArr, LinePoint, null);

    if (!window.localStorage) {
      alert("你的浏览器不支持localStorage");
      return false;
    } else {
      var storage = window.localStorage;
      if (!storage.getItem("secret")) {
        Alert_info.innerHTML =  "尚未设置手势密码,请先设置密码";
      } else if (storage.getItem("secret") != LinePoint){
        Alert_info.innerHTML =  "手势密码输入错误";
      } else {
        Alert_info.innerHTML = "手势密码正确,成功通过!";
      }
    }
    LinePoint = [];
  }, false);
}



















