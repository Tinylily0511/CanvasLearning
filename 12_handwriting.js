let canvasWidth = Math.min(800, $(window).width()-20)
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

if (window.screen.availWidth < 768) {
  canvasWidth = window.screen.availWidth - 20
  window.onload = function startup(){
    canvas.addEventListener('touchstart', function (e) {
      e.preventDefault()
      isMouseDown = true
      lastLoc = windowToCanvas(e.clientX, e.clientY)
      lastTimestamp = new Date().getTime()
      console.log(e.touches);
    }, false )
    
    canvas.addEventListener('touchend', function (e) {
      e.preventDefault()
      isMouseDown = false
    }, false) 
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault()
      if (isMouseDown) {
        let curLoc = windowToCanvas(e.clientX, e.clientY)
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
    }, false) 
  }
} else {
  canvas.onmousedown = function (e) {
    e.preventDefault()
    isMouseDown = true
    lastLoc = windowToCanvas(e.clientX, e.clientY)
    lastTimestamp = new Date().getTime()
  }

  canvas.onmouseup = function (e) {
    e.preventDefault()
    isMouseDown = false
  }

  canvas.onmouseout = function (e) {
    e.preventDefault()
    isMouseDown = false
  }

  canvas.onmousemove = function (e) {
    e.preventDefault()
    if (isMouseDown) {
      let curLoc = windowToCanvas(e.clientX, e.clientY)
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
  }
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