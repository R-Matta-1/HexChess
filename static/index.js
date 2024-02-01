console.log('run')

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");

const colors = ['#212316', '#71764c', '#bdc19f']
//const colors = ['#556edb','#d85186','#bdc19f']

const hexSize = 42
const img = new Image()
      img.src = 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Chess_Pieces_Sprite.svg'
var hexGrid = [] 

var mouseX = 0
var mouseY = 0
var mouseDown = false
ctx.font = "bold 18px Arial "; //for debuging

document.addEventListener('mousedown', () => {
  mouseDown = true;
  clickEffect()
})

document.addEventListener('mouseup', () => {
  mouseDown = false
})

document.addEventListener('mousemove', (event) => {

  let rect = canvas.getBoundingClientRect();
  mouseX = Math.floor(event.clientX - rect.left) * 2
  mouseY = Math.floor(event.clientY - rect.top) * 2

  document.getElementById("console").innerHTML = `${mouseX}, ${mouseY}, ${mouseDown}`

})

class Hex {
  constructor(x, y, idX, idY, size,type, colorIndex) {
    this.x = x
    this.y = y
    this.idX = idX
    this.idY = idY
    this.size = size
    this.colorIndex = colorIndex
    this.opt = false
    this.type = type
    
  }

  draw(debug, sizeChange) {
    DrawHex(this.x, this.y, this.size + sizeChange, (this.opt) ? 'red' : colors[this.colorIndex % colors.length], )

    if (this.type != 0) {

     let Dwidth = this.size*1.5


      ctx.drawImage(img,
       ( Math.abs(this.type)-1) * 45, (this.type < 0) ? 45 : 0, //S,X,Y
        45, 45,                                            //S,W,H
        this.x - Dwidth/2 , this.y - Dwidth/2 ,                 //D,X,Y
        Dwidth , Dwidth)                                          //D,W,H
    }


    if (debug) {
      ctx.fillStyle = "white"
      ctx.fillText(`${this.idX},${this.idY}`, this.x - this.size / 3, this.y + this.size / 2 + 10)

    }

  }


}



//drawing individual Hexagons
function DrawHex(Xcenter, Ycenter, size, color) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.beginPath();
  ctx.moveTo(Xcenter + size * Math.cos(0), Ycenter + size * Math.sin(0));
  for (let i = 1; i < 6; i++) {
    ctx.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / 6),
      Ycenter + size * Math.sin(i * 2 * Math.PI / 6));
  }
  ctx.closePath();
  ctx.fill();
}
//Drawing the grid
function initGrid(BaseX, BaseY, HexSize, width) {
  hexGrid = []
  let Diameter = Math.sqrt(3) * HexSize
  let hexNum = 0

  for (let i = 0; i <= 1; i++) {
    for (let x = -width + i; x <= width - i; x += 2) {
      hexGrid[x + width] = []
      let total = (2 * width) + 1 - Math.abs(x)
      hexNum = Math.abs(x) % 3;

      for (let y = 0; y < total; y++) {
        let Xcenter = BaseX + (HexSize * 1.5 * x)
        let Ycenter = BaseY - ((HexSize) * (Math.sin(Math.PI / 3) * 1)) + (Diameter * (y - total / 2))
        let idX = x + width
        let idY = 2 * y + Math.abs(x)

        let MakeHex = new Hex(Xcenter, Ycenter, idX, idY, HexSize,0, hexNum % 3)
        hexGrid[idX][idY] = MakeHex
        DrawHex(Xcenter, Ycenter, HexSize + .5, colors[hexNum % colors.length])
        ctx.fillStyle = "white"
        ctx.fillText(`${idX},${idY}`, Xcenter - 20, Ycenter + HexSize - 20)
        hexNum += 2

      }
    }
  }
}

initGrid(400, 475, hexSize, 5)
hexGrid[5][0].type = -3
hexGrid[5][2].type = -3
hexGrid[5][4].type = -3
hexGrid[5][16].type = 3
hexGrid[5][18].type = 3
hexGrid[5][20].type = 3

function distance(x1, y1, x2, y2) {
  return Math.sqrt(((x1 - x2) ** 2) + (y1 - y2) ** 2)
}

function drawGrid() {

  for (let x = 0; x < hexGrid.length; x++) {
    let Xaxis = hexGrid[x];
    for (let y = 0; y < Xaxis.length; y++) {
      let hex = Xaxis[y];
      if (hex === undefined) {
        continue
      }
if (hex.idY == mouseHex.y && mouseDown) {
  hex.opt = true
}
      hex.draw(true, 1)
      hex.opt = false

      y++
    }
  }
}

function clickEffect() {
  for (let x = 0; x < hexGrid.length; x++) {
    let Xaxis = hexGrid[x];
    for (let y = 0; y < Xaxis.length; y++) {
      let hex = Xaxis[y];
      if (hex === undefined) {
        continue
      }

      if (distance(hex.x, hex.y, mouseX, mouseY) < hexSize * Math.sqrt(3) / 2 && mouseDown) {
        hexGrid[x][y].opt = true
        mouseHex.x = hex.idX
        mouseHex.y = hex.idY

      }
      y++
    }
  }

}


let mouseHex = {
  x: 0,
  y: 0
}

function frame() {
  ctx.clearRect(0, 0, 800, 800)

  clickEffect()

  drawGrid()


  requestAnimationFrame(frame)
}
frame()