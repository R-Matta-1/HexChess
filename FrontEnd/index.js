const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
//tx.translate(.5, .5)

var colors = ['black','#444','gray']
const boardHeight =  [6,7,8,9,10, 11,10,9,8,7,6]


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

function drawGrid(BaseX,BaseY,gridSize) {
let Diameter = Math.sqrt(3)*gridSize
let hexNum=0

for (let i = 0; i <=1; i++) {

    for (let x = -5 +i; x <=5-i ; x+=2) {

        let total = boardHeight[x+5]
        let y = 0
    hexNum =  Math.abs(x) % 3*-1 ;

        for ( ; y < total ; y++) {
            
            DrawHex(
                    BaseX+(gridSize*1.5*x),//x
                    BaseY-((gridSize)*(Math.sin(Math.PI/3)*1))+((Diameter*(y-total/2))),//y
                    gridSize+.5,
            colors[hexNum % 3])
            hexNum++
            document.getElementById('console').innerHTML += x-y + '    '
        }
   
}
}

}

drawGrid(400,450,40)