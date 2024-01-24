const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const colors = ['black','#444','gray']


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
function drawGrid(BaseX,BaseY,HexSize,width) {
let Diameter = Math.sqrt(3)*HexSize
let hexNum=0

for (let i = 0; i <=1; i++) {

    for (let x = -width +i; x <=width-i ; x+=2) {

        let total = (2 * width)+1 - Math.abs(x)
        hexNum =  Math.abs(x) % 3 ;

        for ( let y = 0 ; y < total ; y++) {
            let Xcenter = BaseX+(HexSize*1.5*x)
            let Ycenter = BaseY-((HexSize)*(Math.sin(Math.PI/3)*1))+(Diameter*(y-total/2))
            
            DrawHex( Xcenter, Ycenter,HexSize+.5, colors[hexNum % 3])
            hexNum+=2
    
        }
   
}
}

}

drawGrid(400,450,40,5)