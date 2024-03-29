console.log("run");
const mode = document.getElementById("gameMode").innerHTML;
const canvas = document.getElementById("canvas");
const Wpoints = document.getElementById('Wpoints') ;
const Bpoints = document.getElementById('Bpoints') ;
const ctx = canvas.getContext("2d");
var debug = false
var Bcanvas;
var Bctx;
const isLocal = (mode == 'local')
const roomCode=0;

if (isLocal) {
   Bcanvas = document.getElementById("blackCanvas");
  Bctx= document.getElementById("blackCanvas").getContext("2d")
Bctx.font = "bold 18px Arial "; //for debuging
} else{
 var socket = new io()
 var peopleHere = 0
 const roomCode = document.getElementById('playerSide').innerHTML
 socket.on('disconnect', (s)=> {
  console.log('dis')
  socket.join(roomCode)
 })
 socket.on('message',(data)=>{
if (data.type == 'join') {
      peopleHere++
    }
if (data.type == 'turn') {
  newTurn(data.data['x1'],data.data['y1'],data.data['x2'],
          data.data['y2'],data.data['typ'])
}
if (data.type =='leave') {
  alert('sorry man,somthing happened but between you and me, your the winner ヾ(≧▽≦*)o')
}
})
}

 const timeBoxW=document.getElementById("timerWhite")
 const timeBoxB=document.getElementById("timerBlack") 

 let timeW= parseInt(timeBoxW.innerHTML)*60
 let timeB= parseInt(timeBoxB.innerHTML)*60

  setInterval(()=>{
    if(timeB <= 0|| timeW <= 0) return;
    if(turn <=1) return;
    
  if (playerTurn =='b') {
    timeB-=1 
    timeBoxB.innerHTML = ((timeB%60) >= 10)? `${Math.floor(timeB/60)}:${timeB%60}`:`${Math.floor(timeB/60)}:0${timeB%60}`
    if (timeB <=0) {
      Win('black ran out of time! white wins.')
    }
  }
  if (playerTurn =='w') {
    timeW-=1
    timeBoxW.innerHTML = ((timeW%60) >= 10)? `${Math.floor(timeW/60)}:${timeW%60}`:`${Math.floor(timeW/60)}:0${timeW%60}`
    if (timeW <=0) {
    Win('white ran out of time! black wins.')
  }
  }
 },1000)

const bishopSlope = [[-1, -3],[1, -3],[-1, 3],[1, 3],[2, 0],[-2, 0]];
const rookSlope = [ [0, 2], [0, -2], [-1, 1], [1, 1], [-1, -1], [1, -1]];
const knightSlope = [[-1,-5],[1,5],[-1,5],[1,-5],[3,1],[3,-1],[-3,1],[-3,-1],[2,4],[2,-4],[-2,4],[-2,-4]]

//const colors = ["#212316", "#71764c", "#bdc19f"];
//const colors = ['#ccc', '#fff', '#999']                     //slvr
const colors = ['#e8ab6f', '#ffce9e', '#d18b47']            //basic
//const colors = ['rgb(30, 93, 74)', 'rgb(0, 175, 146)', 'rgb(170, 210, 212)'] //cool ocean
//const colors = ['rgb(255, 78, 189)','rgb(127, 171, 255)','#eee']  //pride

const hexSize = 42;
const img = new Image();
img.src =
  "https://upload.wikimedia.org/wikipedia/commons/b/b2/Chess_Pieces_Sprite.svg";
var hexGrid = [];

//var yourTurn = 
var playerTurn = 'w'
var playerId = 'w'
if(!isLocal){
  playerId = document.getElementById('playerSide').innerHTML
  console.log(playerId)
}
var turn = 0
var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var mouseDownInital = true;
var mouseUpInitial = false;
ctx.font = "bold 18px Arial "; //for debuging

document.addEventListener("mousedown", () => {down()});
document.addEventListener("touchstart", (event) => {
                                    move(event);down()});


document.addEventListener("mouseup", () => {up()});
document.addEventListener("touchend", () => {up()});


document.addEventListener("mousemove", (event) => { move(event)});
document.addEventListener("touchmove", (event) => { move(event)});

function down() {
  if (mouseX < 0 || mouseX > 800 ||mouseY < 0 || mouseY > 800) {
    return
  }
  mouseUpInitial = true;
  mouseDown = true;

  if (mouseDownInital) {
    findMouseHex();

    list = hexGrid[mouseHex.idX][mouseHex.idY].findValid();
    // document.getElementById("console").innerHTML = `${mouseHex.idX}, ${mouseHex.idY}, ${mouseHex.type}`

    for (let i = 0; i < list.length; i++) {
      let coords = list[i];
      hexGrid[coords[0]][coords[1]].opt = true;
    }
  }
  mouseDownInital = false;
}

function up() {
  mouseDown = false;
  mouseDownInital = true;

  if (mouseUpInitial) {
    let selectedType = hexGrid[mouseHex.idX][mouseHex.idY].type;
    let selectedX = mouseHex.idX;
    let selectedY = mouseHex.idY;
    findMouseHex();

       let newHex = hexGrid[mouseHex.idX][mouseHex.idY];
    if (newHex.opt &&
      (((Math.abs(selectedType) == selectedType)? 'w':'b') == playerId ) &&
      playerId == playerTurn) {
      // new turn move

      if (isLocal) {
      newTurn(selectedX, selectedY, mouseHex.idX, mouseHex.idY,selectedType);

      } else{ if(peopleHere >= ((document.getElementById('gameMaker').innerHTML == 'True')? 2:1)){
        socket.emit(
          'message',
          {x1: selectedX,
           y1: selectedY,
           x2:mouseHex.idX,
           y2:mouseHex.idY,
           typ:selectedType})
      }}
    }

    //after we do this, run through and make sure no one is glowing when mouse is up
    for (let x = 0; x < hexGrid.length; x++) {
      let Xaxis = hexGrid[x];
      for (let y = 0; y < Xaxis.length; y++) {
        let hex = Xaxis[y];
        if (hex === undefined) {
          continue;
        }
        hex.opt = false;
        y++;
      }
    }
  }
  mouseUpInitial = false;
}
function move(event) {
  let rect = canvas.getBoundingClientRect();


  mouseX = Math.floor(event.clientX - rect.left) * 2;
  mouseY = Math.floor(event.clientY - rect.top) * 2;
  
  if (isLocal) {
  if (playerTurn == 'b') {
     rect = Bcanvas.getBoundingClientRect();
     mouseY = (((Math.floor(event.clientY - rect.top) * 2)-400 )*-1 )+400;
     mouseX = (((Math.floor(event.clientX - rect.left) * 2)-400 )*-1 )+400;
  }
  } else{ //we online

    if (playerId == 'b') {
      mouseY = (((Math.floor(event.clientY - rect.top) * 2)-400 )*-1 )+400;
      mouseX = (((Math.floor(event.clientX - rect.left) * 2)-400 )*-1 )+400;
    }
  }
  console.log(`x:${mouseX},y:${mouseY}`)
}

const turnData = {
  Bcheck: false,
  Wcheck: false,
  Wpoints:43,
  Bpoints:43,
}

const pieceToPoint ={
  1:0,
  2:9,
  3:3,
  4:3,
  5:5,
  6:1,
}
function newTurn(oldX, oldY, newX, newY,selectedType) {
  turn++
  hexGrid[newX][newY].type = selectedType;
  hexGrid[oldX][oldY].type = 0;
  (playerTurn == 'w')?playerTurn='b': playerTurn = 'w';

  if (isLocal) {
    (playerId == 'w')?playerId='b': playerId = 'w';
  } 

turnData.Wpoints = 0
turnData.Bpoints = 0
let Wking = []
let Bking = []
let WwaitList = []
let BwaitList = []
for (let x = 0; x < hexGrid.length; x++) {
    for (let y = 0; y < hexGrid[x].length; y++) {
      const hex = hexGrid[x][y];
      if (hex == undefined) {
        continue
      }
      if (hex.type > 0) {
        if (hex.type == 1) {
          Wking = [hex.idX,hex.idY] // get king pos W
        }
       WwaitList =  WwaitList.concat(hex.findValid())   //add the new piece moves
        turnData.Wpoints += pieceToPoint[hex.type]

      }/////////////////////now if black
      else if (hex.type < 0){
        if (hex.type == -1) { 
          Bking = [hex.idX,hex.idY] // get king pos B
        }
       BwaitList =  BwaitList.concat(hex.findValid()) // add new piece moves
        turnData.Bpoints+= pieceToPoint[Math.abs(hex.type)]
      }
      y+=1
    }  }
          ///now we do check analasis
  if (Wking.length == 0) {
    Win('black wins')
  }
  if (Bking.length == 0) {
    Win('white wins') 
  }
  
  turnData.Wcheck = isInCheck(Wking, BwaitList)
  turnData.Bcheck = isInCheck(Bking, WwaitList)

Wpoints.innerHTML = turnData.Wpoints;
Bpoints.innerHTML = turnData.Bpoints;

//if no king 
}
function isInCheck(KingPos, moves) {
  console.log(moves)
  for (let i = 0; i < moves.length; i++) {
    let possibleMove = moves[i];
    if ((KingPos[0] == possibleMove[0]) && (KingPos[1] == possibleMove[1])) {
      return true
    }
  }
  return false
}
function checkGrid(x, y, type) {
  return (
    x < hexGrid.length &&
    x >= 0 &&                        //check valid
    y < hexGrid[x].length &&
    y >= 0 &&                      //check valid
    hexGrid[x][y] != undefined && //check grid
    (hexGrid[x][y].type == 0 || !(hexGrid[x][y].type > 0) == type > 0)
  );
}


class Hex {
  constructor(x, y, idX, idY, size, type, colorIndex) {
    this.x = x;
    this.y = y;
    this.idX = idX;
    this.idY = idY;
    this.size = size;
    this.colorIndex = colorIndex;
    this.opt = false;
    this.type = type;
  }
  findValid() {
    let awns = [];
    let slopeX = 0;
    let slopeY = 0;
    let isFirst = false

    switch (this.type) {
      case 0:
        break;
      case -1: //king
      case 1:
        for (let i = 0; i < 2; i++) {                 /* these show that you loop twice   */
          let list = (i==0)?  rookSlope:bishopSlope;  /* once on rookSlope onece on Bishop*/
          for (let k = 0; k < list.length; k++) {
            slopeX = list[k][0];                      
            slopeY = list[k][1];
            let y = this.idY + slopeY;
            let x = this.idX + slopeX;
            if(checkGrid(x,y,this.type)){// check type 
              awns.push([x,y])}
          }
        }
        break;
      case 2: //queen
      case -2:
      case 3: //bishop
      case -3:
        for (let i = 0; i < bishopSlope.length; i++) {
          slopeX = bishopSlope[i][0];
          slopeY = bishopSlope[i][1];
          let y = this.idY + slopeY;
          let x = this.idX + slopeX;
          while (
            checkGrid(x, y, this.type) && // check type
            (hexGrid[x - slopeX][y - slopeY].type == 0 ||
              hexGrid[x - slopeX][y - slopeY] == hexGrid[this.idX][this.idY]) //check no pass
            //     iether the thing before me is blank    or this is checking step1
          ) {
            awns.push([x, y]);
            y += slopeY;
            x += slopeX;
          }
       //   document.getElementById("console").innerHTML = `${x},${y}`;
        }
        if (Math.abs(this.type) == 3) {
          break
        }
      case 5: //rook
      case -5:
        for (let i = 0; i < rookSlope.length; i++) {
          slopeX = rookSlope[i][0];
          slopeY = rookSlope[i][1];
          let y = this.idY + slopeY;
          let x = this.idX + slopeX;
          while (
            checkGrid(x, y, this.type) && // check type
            (hexGrid[x - slopeX][y - slopeY].type == 0 ||
              hexGrid[x - slopeX][y - slopeY] == hexGrid[this.idX][this.idY]) //check no pass
            //     iether the thing before me is blank    or this is checking step1
          ) {
            awns.push([x, y]);
            y += slopeY;
            x += slopeX;
          }
        }
        
          break
      case 4: //knight
      case -4:
      
    for (let i = 0; i < knightSlope.length; i++) {
      slopeX = knightSlope[i][0]
      slopeY = knightSlope[i][1]
          let y = this.idY + slopeY
          let x = this.idX +slopeX
      if(checkGrid(x,y,this.type)){// check type 
        awns.push([x,y])
        y += slopeY
        x += slopeX
       }}
       break;
      case 6: //pawn
       slopeY =-2
      case -6://pawn
        if (slopeY == 0 ) slopeY = 2;
if (this.idY+slopeY < 0 || this.idY+slopeY > hexGrid[this.idX].length) {
  this.type = (this.type < 0 )? -2: 2;
  this.findValid()
  break
}

// find out if the pawn is in the place to be able to double jump
if(this.type> 0 ){
  isFirst = Math.abs(5-this.idX) - this.idY == -12 
} else{
  isFirst = Math.abs(5-this.idX) + this.idY == 8
}

       if (checkGrid(this.idX,this.idY+slopeY,hexGrid[this.idX][this.idY+slopeY].type) ) {
        awns.push([this.idX,this.idY+slopeY])
        if (isFirst) {  //first move 
          if (checkGrid(this.idX,this.idY+(slopeY*2),hexGrid[this.idX][this.idY+(slopeY*2)].type) ) {
            awns.push([this.idX,this.idY+(slopeY*2)])
        }}
       }
       //check side atack left
       if (checkGrid(this.idX+1,this.idY+(slopeY/2),this.type) && 
       hexGrid[this.idX+1][this.idY+(slopeY/2)].type != 0) {
        awns.push([this.idX+1,this.idY+(slopeY/2)])
       }
       //check attack right
       if (checkGrid(this.idX-1,this.idY+slopeY/2,this.type) ) {
        if (hexGrid[this.idX-1][this.idY+(slopeY/2)].type != 0) {
          awns.push([this.idX-1,this.idY+(slopeY/2)])
         };
       }


       break
      default:
        break;
    }
    return awns;
  }

  draw(context,flip, sizeChange) {
      if (flip){
      this.y = ((this.y-400)*-1)+400
      this.x = ((this.x-400)*-1)+400
      }
      DrawHex(context,
        this.x,
        this.y,
        this.size + sizeChange,
        colors[this.colorIndex % colors.length],
      );
      
      if (this.type != 0) {
        let Dwidth = this.size * 1.5;
  
        context.drawImage(
          img,
          (Math.abs(this.type) - 1) * 45,
          this.type < 0 ? 45 : 0, //S,X,Y
          45,
          45, //S,W,H
          this.x - Dwidth / 2,
          this.y - Dwidth / 2, //D,X,Y
          Dwidth,
          Dwidth,
        ); //D,W,H
      }
  
      if (debug) {
        context.fillStyle = "white";
        context.fillText(
          `${this.idX},${this.idY}`,
          this.x - this.size / 3,
          this.y + this.size / 2 + 10,);
      }
      if (this.opt == true) {
        DrawHex(context,this.x,this.y,this.size/2,'#454')
      }
      if (flip){
        this.y = ((this.y-400)*-1)+400
        this.x = ((this.x-400)*-1)+400
        }
    
  }


}

//drawing individual Hexagons
function DrawHex(context,Xcenter, Ycenter, size, color) {
  context.strokeStyle = color;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(Xcenter + size , Ycenter ); //context.moveTo(Xcenter + size * Math.cos(0), Ycenter + size * 0);
  for (let i = 1; i < 6; i++) {
    context.lineTo(
      Xcenter + size * Math.cos((i * 2 * Math.PI) / 6),
      Ycenter + size * Math.sin((i * 2 * Math.PI) / 6),
    );
  }
  context.closePath();
  context.fill();
}

//Drawing the grid, place the pieces
function initGrid(BaseX, BaseY, HexSize, width) {
  hexGrid = [];
  let Diameter = Math.sqrt(3) * HexSize;
  let hexNum = 0;

  for (let i = 0; i <= 1; i++) {
    for (let x = -width + i; x <= width - i; x += 2) {
      hexGrid[x + width] = [];
      let total = 2 * width + 1 - Math.abs(x);
      hexNum = Math.abs(x) % 3;

      for (let y = 0; y < total; y++) {
        let Xcenter = BaseX + HexSize * 1.5 * x;
        let Ycenter =
          BaseY -
          HexSize * (Math.sin(Math.PI / 3) * 1) +
          Diameter * (y - total / 2);
        let idX = x + width;
        let idY = 2 * y + Math.abs(x);

        let MakeHex = new Hex( Xcenter, Ycenter, idX, idY, HexSize, 0, hexNum % 3,);
        hexGrid[idX][idY] = MakeHex;

        ctx.fillStyle = "white";
        ctx.fillText(`${idX},${idY}`, Xcenter - 20, Ycenter + HexSize - 20);
        hexNum += 2;
      }
    }
  }
}

//init types and
initGrid(400, 475, hexSize, 5); //king1, queen2, bishop3, rook5,horse4 pawn6
const StartList = [ 
  [1, 16, 6], [2, 15, 6], [3, 14, 6], [4, 13, 6], [5, 12, 6], [6, 13, 6], [7, 14, 6], [8, 15, 6], [9, 16, 6],
  [2, 17, 5],
  [8, 17, 5],
  [3, 18, 4],
  [7, 18, 4],
  [5, 16, 3],
  [5, 18, 3],
  [5, 20, 3],
  [4, 19, 2],
  [6, 19, 1],
];
for (let i = 0; i <= 1; i++) { // place every part of the list, then flip it
  let flip = i;
  for (let k = 0; k < StartList.length; k++) {
    let rule = StartList[k];
    if (flip) {
      rule[0];
      hexGrid[rule[0]][(rule[1] - 10) * -1 + 10].type = rule[2] * -1;
    } else {
      hexGrid[rule[0]][rule[1]].type = rule[2];
    }
  }
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function drawGrid() {
  for (let x = 0; x < hexGrid.length; x++) {
    let Xaxis = hexGrid[x];
    for (let y = 0; y < Xaxis.length; y++) {
      let hex = Xaxis[y];
      if (hex === undefined) {
        continue;
      }
///////////////////////
  
      if (isLocal) {
        hex.draw(Bctx,true, 1);
        hex.draw(ctx,false, 1);
      }

      if (!isLocal && playerId == 'w') {
        hex.draw(ctx,false, 1);
      }
      if (!isLocal && playerId == 'b') {
        hex.draw(ctx,true, 1);
      }
/////////////////////////////
      y++;
    }
  }
}

function findMouseHex() {
  for (let x = 0; x < hexGrid.length; x++) {
    let Xaxis = hexGrid[x];
    for (let y = 0; y < Xaxis.length; y++) {
      let hex = Xaxis[y];
      if (hex === undefined) {
        continue;
      }
      if (
        distance(hex.x, hex.y, mouseX, mouseY) <
        (hexSize * Math.sqrt(3)) / 2
      ) {
        mouseHex.idX = hex.idX;
        mouseHex.idY = hex.idY;
        mouseHex.type = hex.type;
      }
      y++;
    }
  }
}

let mouseHex = {
  idX: 5,
  idY: 10,
  type: 0,
};

function Win(message) {
  //todo,makebox, open with message,
  alert(message) 
  return
}

let Wcolor;
let Bcolor;
function frame() {
  ctx.clearRect(0, 0, 800, 800);


  Wcolor = (turnData.Wcheck) ? 'red' : 'black'
  Bcolor = (turnData.Bcheck) ? 'red' : 'black'
  
  if (isLocal) {////// if local
  	Bctx.clearRect(0, 0, 800, 800);
  	if (playerTurn == 'w') {
  		DrawHex(ctx, 400, 400, 400,Wcolor )
  	} else {
  		DrawHex(Bctx, 400, 400, 400,Bcolor )
    }

  } else if (playerTurn == playerId) { //// if not lcoal
  	if (playerId == 'w') {
  		DrawHex(ctx, 400, 400, 400, Wcolor) //todo

  	} else {
  		DrawHex(ctx, 400, 400, 400, Bcolor) //todo

  	}
  }
  drawGrid();

  requestAnimationFrame(frame);
}
frame();