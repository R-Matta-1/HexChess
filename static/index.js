console.log('run')

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
ctx.font = "bold 20px Arial "; //for debuging
const colors = ['#12130c','#71764c','#bdc19f'] 
//const colors = ['#556edb','#d85186','#ebecd0']
var hexGrid =  [] // []
//                 //
//             \_________/

ctx.fillRect(0,0,900,800)
//drawing individual Hexagons
function DrawHex(Xcenter,Ycenter,size,color) {
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.beginPath();
ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0)); 
    for (let i = 1; i < 6; i++) {
     ctx.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / 6),
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
       hexGrid[x+width]=[]

        let total = (2 * width) + 1 - Math.abs(x)
        hexNum = Math.abs(x) % 3;
  
        for (let y = 0; y < total; y++) {
          let Xcenter = BaseX + (HexSize * 1.5 * x)
          let Ycenter = BaseY - ((HexSize) * (Math.sin(Math.PI / 3) * 1)) + (Diameter * (y - total / 2))
          let idX = x+width
          let idY = 2*y+Math.abs(x)
          hexGrid[idX][idY] = //new Hex(Xcenter,Ycenter,idX,idY,HexSize,hexNum % 3)
          DrawHex(Xcenter, Ycenter, HexSize + .5, colors[hexNum % 3])
  
          ctx.fillStyle = "white"
          ctx.fillText(`${idX},${idY}`, Xcenter - 20, Ycenter+HexSize-20)
          hexNum += 2
  
        }
      }
    }
   // document.getElementById('console').innerHTML = hexGrid[3][4]
  }

initGrid(400,475,42,5)

class Hex  {
constructor(x,y,idX,idY,size,colorIndex){
this.x = x
this.y = y
this.idX = idX
this.idY = idY
this.size = size
this.colorIndex = colorIndex
}}