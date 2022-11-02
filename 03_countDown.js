const WIDTH = 800;
const HEIGHT = 500;
const MARGIN_TOP = Math.round(WIDTH / 5);
const MARGIN_LEFT = Math.round(HEIGHT / 10);
const R = Math.round(WIDTH * 4 / 5 / 108) - 1;

const END_TIME = new Date();
END_TIME.setTime(END_TIME.getTime() + 7200 * 1000);

let balls = [];
const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];
let timer = null;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

let curShowTimeSeconds = getCurTimeSeconds();

function getCurTimeSeconds() {
  const curTime = new Date();
  let ret = Math.round((END_TIME.getTime() - curTime.getTime())/ 1000)
  if (ret < 0) {
    clearInterval(timer);
    timer = null;
    return 0;
  }
  return ret;
}

timer = setInterval(() => {
  render(ctx);
  update();
}, 50);

function render() {
  if (!balls.length) {
    return;
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const hours = parseInt(curShowTimeSeconds / 3600);
  const minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
  const seconds = curShowTimeSeconds % 60;

  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), ctx);
  renderDigit(MARGIN_LEFT + 15 * (R + 1), MARGIN_TOP, parseInt(hours % 10), ctx);
  renderDigit(MARGIN_LEFT + 30 * (R + 1), MARGIN_TOP, 10, ctx);

  renderDigit(MARGIN_LEFT + 39 * (R + 1), MARGIN_TOP, parseInt(minutes / 10), ctx);
  renderDigit(MARGIN_LEFT + 54 * (R + 1), MARGIN_TOP, parseInt(minutes % 10), ctx);
  renderDigit(MARGIN_LEFT + 69 * (R + 1), MARGIN_TOP, 10, ctx);

  renderDigit(MARGIN_LEFT + 78 * (R + 1), MARGIN_TOP, parseInt(seconds / 10), ctx);
  renderDigit(MARGIN_LEFT + 93 * (R + 1), MARGIN_TOP, parseInt(seconds % 10), ctx);

  for (let i = 0, len = balls.length; i < len; i++) {
    ctx.fillStyle = balls[i].color;
    ctx.beginPath();
    ctx.arc(balls[i].x, balls[i].y, R, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
}

// 第(i,j)个圆的圆心位置 centerX: x+j*2*(r+1)+r+1 / centerY: y+i*2*(r+1)+r+1
function renderDigit(x, y, num, ctx) {
  ctx.fillStyle = 'rgb(0,102,153)';
  for (let i = 0, len = digit[num].length; i < len; i++) {
    for (let j = 0, len2 = digit[num][i].length; j < len2; j++) {
      if (digit[num][i][j] === 1) {
        ctx.beginPath();
        ctx.arc(x + j * 2 * (R + 1) + R + 1, y + i * 2 * (R + 1) + R + 1, R, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

function update() {
  const nextTimeSeconds = getCurTimeSeconds();
  const nextHours = parseInt(nextTimeSeconds / 3600);
  const nextMinutes = parseInt((nextTimeSeconds - nextHours * 3600) / 60);
  const nextSeconds = nextTimeSeconds % 60;

  const curHours = parseInt(curShowTimeSeconds / 3600);
  const curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
  const curSeconds = curShowTimeSeconds % 60;

  if (nextSeconds !== curSeconds) {
    curShowTimeSeconds = nextTimeSeconds;
    if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
      addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
    }
    if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
      addBalls(MARGIN_LEFT + 15 * (R + 1), MARGIN_TOP, parseInt(curHours / 10));
    }

    if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
      addBalls(MARGIN_LEFT + 39 * (R + 1), MARGIN_TOP, parseInt(curMinutes / 10));
    }
    if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
      addBalls(MARGIN_LEFT + 54 * (R + 1), MARGIN_TOP, parseInt(curMinutes % 10));
    }

    if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
      addBalls(MARGIN_LEFT + 78 * (R + 1), MARGIN_TOP, parseInt(curSeconds / 10));
    }
    if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
      addBalls(MARGIN_LEFT + 93 * (R + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
    }
  }
  updateBalls();
}

function addBalls(x, y, num) {
  for (let i = 0, len = digit[num].length; i < len; i++) {
    for (let j = 0, len2 = digit[num][i].length; j < len2; j++) {
      if (digit[num][i][j] === 1) {
        const aBall = {
          x: x + j * 2 * (R + 1) + (R + 1),
          y: y + i * 2 * (R + 1) + (R + 1),
          g: 1.5 + Math.random(),
          vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,//-4或4
          vy: -5,
          color: colors[Math.floor(Math.random() * colors.length)]
        }
        balls.push(aBall)
      }
    }
  }
}

function updateBalls() {
  for (let i = 0, len = balls.length; i < len; i++) {
    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += balls[i].g;
    if (balls[i].y >= HEIGHT - R) {
      balls[i].y = HEIGHT - R;
      balls[i].vy = -balls[i].vy * 0.5;
    }
  }
  //把超出画布的小球弄出去
  balls = balls.filter(item => (item.x + R > 0) && (item.x - R < WIDTH));
  //保持计算机性能，最多出现300个小球
  balls = balls.length < 300 ? balls : balls.slice(0, 301);
}