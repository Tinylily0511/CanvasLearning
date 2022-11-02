let canvasWidth = window.screen.width < 820 ? window.screen.availWidth - 20 : 800
console.log(window.screen.availWidth);
let canvasHeight = canvasWidth

let strokeColor = 'black'
let isMouseDown = false
let lastLoc = { x: 0, y: 0 }
let lastTimestamp = 0
let lastLineWidth = -1
  
let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')

canvas.width = canvasWidth
canvas.height = canvasHeight

// document.getElementById('controller').style.width = `${canvasWidth}px`
$('#controller').css('width', canvasWidth + 'px')

drawGrid()

// document.getElementById('clear_btn').addEventListener('click', function (e) {
//   context.clearRect(0, 0, canvasWidth, canvasHeight)
//   drawGrid()
// })
$('#clear_btn').click(
  function () {
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    drawGrid()
  }
)

// let btns = document.querySelectorAll('.color_btn')
// for (let i = 0; i < btns.length; i++){
//   btns[i].onclick = function () {
//     for (let j = 0; j < btns.length; j++) {
//       btns[j].className = 'color_btn'
//     }
//     btns[i].className = 'color_btn color_btn_selected'
//     strokeColor = getComputedStyle(btns[i],null)['backgroundColor']
//   } 
// }
$(".color_btn").click(
function () {
  $(this).addClass('color_btn_selected').siblings().removeClass('color_btn_selected')
  strokeColor = $(this).css('background-color')
}
)

canvas.addEventListener('touchstart', function (e) {
  e.preventDefault()
  touch = e.touches[0]
  beginStroke({ x: touch.pageX, y: touch.pageY })
})
  
canvas.addEventListener('touchend', function (e) {
  e.preventDefault()
  endStroke()
})

canvas.addEventListener('touchmove', function (e) {
  e.preventDefault()
  if (isMouseDown) {
    touch = e.touches[0]
    moveStroke({ x: touch.pageX, y: touch.pageY })
  }
}) 

canvas.onmousedown = function (e) {
  e.preventDefault()
  beginStroke({ x: e.clientX, y: e.clientY })
}

canvas.onmouseup = function (e) {
  e.preventDefault()
  endStroke()
}

canvas.onmouseout = function (e) {
  e.preventDefault()
  endStroke()
}

canvas.onmousemove = function (e) {
  e.preventDefault()
  if (isMouseDown) {
    moveStroke({ x: e.clientX, y: e.clientY })
  }
}

function beginStroke(point) {
  isMouseDown = true
  lastLoc = windowToCanvas(point.x, point.y)
  lastTimestamp = new Date().getTime()
}
function endStroke() {
  isMouseDown = false
}
function moveStroke(point) {
  let curLoc = windowToCanvas(point.x, point.y)
  let curTimestamp = new Date().getTime()
  let s = calcDistance(curLoc, lastLoc)
  let t = curTimestamp - lastTimestamp

  let lineWidth = calclineWidth(t, s)

  context.beginPath()
  context.moveTo(lastLoc.x, lastLoc.y)
  context.lineTo(curLoc.x, curLoc.y)

  context.strokeStyle = strokeColor
  context.lineWidth = lineWidth
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.stroke()

  lastLoc = curLoc
  lastTimestamp = curTimestamp
  lastLineWidth = lineWidth
}

function windowToCanvas(x, y) {
  let bbox = canvas.getBoundingClientRect()
  return {x: Math.round(x-bbox.left), y: Math.round(y-bbox.top)}
}

function calcDistance(loc1, loc2) {
  return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)* (loc1.y - loc2.y))
}

let maxLineWidth = 30
let minLineWidth = 1
let maxStrokeV = 10
let minStrokeV = 0.1
function calclineWidth(t, s) {
  let v = s / t
  let resLineWidth
  if (v <= minStrokeV) {
    resLineWidth = maxLineWidth
  } else if (v >= maxStrokeV) {
    resLineWidth = minLineWidth
  } else {
    resLineWidth = maxLineWidth - (v - minStrokeV) / (maxStrokeV - minStrokeV) * (maxLineWidth - minLineWidth)    
  }
  if (lastLineWidth == -1) return resLineWidth
  return lastLineWidth*2/3 + resLineWidth*1/3
}

function drawGrid() {
  context.save()
  context.strokeStyle = 'rgb(230,11,9'

  context.beginPath()
  context.moveTo(3, 3)
  context.lineTo(canvasWidth - 3, 3)
  context.lineTo(canvasWidth - 3, canvasHeight - 3)
  context.lineTo(3, canvasHeight - 3)
  context.closePath()

  context.lineWidth = 6
  context.stroke()

  context.beginPath()
  context.moveTo(0, 0)
  context.lineTo(canvasWidth, canvasHeight)
  context.moveTo(canvasWidth, 0)
  context.lineTo(0, canvasHeight)
  context.moveTo(canvasWidth / 2, 0)
  context.lineTo(canvasWidth / 2, canvasHeight)
  context.moveTo(0, canvasHeight / 2)
  context.lineTo(canvasWidth, canvasHeight / 2)

  context.lineWidth = 1
  context.stroke()

  context.restore()
}