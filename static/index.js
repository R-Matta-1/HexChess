console.log('rueen')
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
var mouseDownInital = true
var mouseUpInitial = false
ctx.font = "bold 18px Arial "; //for debuging

document.addEventListener('mousedown', () => {
  mouseUpInitial = true
  mouseDown = true;

  if (mouseDownInital) {
    findMouseHex()
    
    
   list= hexGrid[mouseHex.idX][mouseHex.idY]. findValid()
  // document.getElementById("console").innerHTML = `${mouseHex.idX}, ${mouseHex.idY}, ${mouseHex.type}`

   for (let i = 0; i < list.length; i++) {
    let coords = list[i];
hexGrid[coords[0]][coords[1]].opt=true
    
   }

  }
  mouseDownInital = false

})

document.addEventListener('mouseup', () => {
  mouseDown = false
  mouseDownInital = true

  if (mouseUpInitial) {
    let selected = hexGrid[mouseHex.idX][mouseHex.idY].type
    let selectedX = mouseHex.idX
    let selectedY = mouseHex.idY
    findMouseHex()

    if (hexGrid[mouseHex.idX][mouseHex.idY].opt) {

      hexGrid[mouseHex.idX][mouseHex.idY].type = selected
      hexGrid[selectedX][selectedY].type = 0
    }
    //after we do this, run through and make sure no one is glowing when mouse is up
    for (let x = 0; x < hexGrid.length; x++) {
      let Xaxis = hexGrid[x];
      for (let y = 0; y < Xaxis.length; y++) {
        let hex = Xaxis[y];
        if (hex === undefined) {
          continue
        }
        hex.opt = false ;
        y++
      }
    }
  }
  mouseUpInitial = false
})

document.addEventListener('mousemove', (event) => {

  let rect = canvas.getBoundingClientRect();
  mouseX = Math.floor(event.clientX - rect.left) * 2
  mouseY = Math.floor(event.clientY - rect.top) * 2


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
findValid(){
 let awns = []
  switch (this.type) {
    case 0:
break
    case -1://king
    case 1:
      

      
    case 2://queen
    case-2:
    
    case 3: //bishop
    case-3:
 let slopeX=-1
 let slopeY=-3

    for (let i = 0; i < 6; i++) {
             if (i==0) {  slopeX = -1; slopeY = -3} 
        else if (i==1) {  slopeX =  1; slopeY = -3} 
        else if (i==2) {  slopeX = -1; slopeY = 3} 
        else if (i==3) {  slopeX =  1; slopeY = 3} 
        else if (i==4) {  slopeX = 2 ; slopeY = 0} 
        else if (i==5) {  slopeX = -2 ; slopeY = 0} 
        
    let y = this.idY + slopeY
    let x = this.idX +slopeX
 while ((x<hexGrid.length && x >= 0 )   //check valid
     && (y<hexGrid[x].length && y >= 0)   //check valid
     && hexGrid[x][y] != undefined  //check grid
     && (hexGrid[x][y].type == 0 || !(hexGrid[x][y].type>0)==(this.type>0))  // check type 
     && (hexGrid[x-slopeX][y-slopeY].type == 0 || hexGrid[x-slopeX][y-slopeY] == hexGrid[this.idX][this.idY] )//check no pass 
    //     iether the thing before me is blank    or this is checking step1 
  ) {

  awns.push([x,y])

  y += slopeY
  x += slopeX
 }
document.getElementById('console').innerHTML = `${x},${y}`
    }
    case 5: //rook
    case -5:

    case 4: //knight
    case-4:
    


    case 6: //pawn
    case-6:



    default:
      
     // awns.push([this.idX+2,this.idY+2])
      break
  }
  return awns
}

  draw(debug, sizeChange) {
//move to new lcal


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

//Drawing the grid, place the pieces
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

//init types and 
initGrid(400, 475, hexSize, 5)
const StartList=[[1,16,6],[2,15,6],[3,14,6],[4,13,6],[5,12,6],[6,13,6],[7,14,6],[8,15,6],[9,16,6]]
for (let i = 0; i <= 1; i++) {
 let flip = i
for (let k = 0; k < StartList.length; k++) {
  let rule = StartList[k];
  if (flip) {rule[0]
  hexGrid[rule[0]][((rule[1]-10)*-1)+10].type = rule[2] *-1
  }else{
  hexGrid[rule[0]][rule[1]].type = rule[2] 
}
}
}

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


      hex.draw(true, 1)

      y++
    }
  }
}

 function findMouseHex(){ 
  

  for (let x = 0; x < hexGrid.length; x++) {
    let Xaxis = hexGrid[x];
    for (let y = 0; y < Xaxis.length; y++) {
      let hex = Xaxis[y];
      if (hex === undefined) {
        continue
      }
      if (distance(hex.x, hex.y, mouseX, mouseY) < hexSize * Math.sqrt(3) / 2 ) {
        mouseHex.idX = hex.idX
        mouseHex.idY = hex.idY
        mouseHex.type = hex.type

      }
      y++
    }
  }

}


let mouseHex = {
  idX: 5,
  idY: 10,
  type:0
}

function frame() {

  DrawHex(400,400,400,'black')

  drawGrid()

  requestAnimationFrame(frame)
}
frame()