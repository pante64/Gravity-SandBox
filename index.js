/*
================================= GRAVITOL / Pante 2026 =================================
Educational purposes.
Done only and by Pante and with a lot of online help.
Discontinued for now.
Sorry for the messy code hehe.

*/


const canvas = document.getElementById("education"); 
const ctx = canvas.getContext("2d"); 
let input = document.getElementById("range"); 
const button = document.getElementById("btn") 
const h1 = document.getElementById("h1"); 
let velo = document.getElementById("velo"); 
const h2 = document.getElementById("h2"); 
const h3 = document.getElementById("h3"); 
let horizontal = document.getElementById("horizontal"); 
let pause = document.getElementById("pause"); 
let running = false;let bounce = 0.75;let rightwall = 0;let leftwall = 0;let topwall = 0;let isDragging = false;let offsetX = 0;let offsetY = 0; 
let ultimoX = 0; let ultimoY = 0;let tAnt = 0; let isDrawing = false; let doffSetX = 0; let doffsetY = 0; 
let drawingPoints = []; 
let x1 = 0; 
let x2 = 0; 
let y1 = 0; 
let y2 = 0; 
let squashX = 1;
let squashY = 1;
let targetSquashX = 1;
let targetSquashY = 1;
let impactSquashX = 1;
let impactSquashY = 1;
let squashTimer = 0;
let squashDuration = 10;
let startSelected = false;
const toggle = document.getElementById("toggle"); 
let drawing = false; 
const canvas2 = document.getElementById("drawing"); 
const ctx2 = canvas2.getContext("2d"); 
// ============ VECTORS MOVEMENT (2/09/2026)=========

class Vector2{
    constructor(x, y){
         this.x = x;
         this.y = y;
    }
}
let velocity = new Vector2(0, 0)
let axis = new Vector2(0, 0)
// ehhh vel calculus 
let span1 = document.getElementById("velX"); 
let span2 = document.getElementById("velY"); 
let span3 = document.getElementById("speed"); 
let speed = Math.hypot(velocity.x, velocity.y); 
let gravity = new Vector2(0, 0.8);
// FORCES ============ also day 2 of sept however at 23 im satrting lets get it
// wind variables (too messy for my eyes so gotta dobthis)
let windcheckbox = document.getElementById("Windcheckbox");
let windinput = document.getElementById("windRange");
let windh = document.getElementById("wvalue");
let wind = new Vector2(0,0);

// pressure
let pressureCheckbox = document.getElementById("Presioncheckbox");
let pressureinput = document.getElementById("pressureRange");
let pressureh = document.getElementById("pvalue");
let pressure = new Vector2(0,0);

// Air Resistance
let airResistancebox = document.getElementById("aircheckbox");
let airresistanceinput = document.getElementById("airRange");
let airresistanceh = document.getElementById("avalue");
let airResistance = new Vector2(0,0);

   let mass = 10;
let isShiftPressed=false;let catapultaActiva=false;let pivoteCatapulta=new Vector2(0,0);let k_elastica=0.12;let maxArrastre=350; //la honda esta jaja

document.addEventListener("keydown",(e)=>{if(e.key==="Shift"){isShiftPressed=true;
if(isDragging&&running&&!catapultaActiva){catapultaActiva=true;pivoteCatapulta.x=axis.x;pivoteCatapulta.y=axis.y;}
}})
document.addEventListener("keyup",(e)=>{if(e.key==="Shift")isShiftPressed=false;})

toggle.onclick = function(){ 
    if(drawing){drawing = false} else {drawing = true} 
} 

// boton de guia pa los que no saben usar esto lol
let guideBtn=document.getElementById("guideBtn");let guidePopup=document.getElementById("guidePopup");let closeGuideBtn=document.getElementById("closeGuideBtn");
let corriaAntesDelPopup=false;
guideBtn.onclick=function(){ 
corriaAntesDelPopup=running;running=false;
guidePopup.style.display="flex"; 
}
closeGuideBtn.onclick=function(){ guidePopup.style.display="none"; 
if(corriaAntesDelPopup){running=true;requestAnimationFrame(gameloop);} }

document.addEventListener("input", () => { 
    h1.textContent = input.value; 
    h2.textContent = velo.value; 
    h3.textContent = horizontal.value; 
    windh.textContent = windinput.value;
    pressureh.textContent = pressureinput.value;
    airresistanceh.textContent = airresistanceinput.value;
    
}) 

canvas.addEventListener("mousedown", (e) => { 


    if(gameloop){
            const rect = canvas.getBoundingClientRect(); 
    const mouseX = e.clientX - rect.left; 
    const mouseY = e.clientY - rect.top; 
  if(mouseX <= axis.x+50 && mouseX >= axis.x && mouseY <= axis.y+50 && mouseY >= axis.y){ 
        document.body.style.cursor = "grab" 
        offsetX = mouseX - axis.x; 
        offsetY = mouseY - axis.y; 
        isDragging = true; 
        isDrawing = false; 
    } else { 
        isDrawing = true; 
        isDragging = false; 
        x1 = mouseX; 
        y1 = mouseY; y2=mouseY;x2=mouseX;
        document.body.style.cursor = "crosshair"; 
    } 
    }
  
}) 

window.addEventListener("mousemove", (e) => { 
    if(gameloop){
const rect = canvas.getBoundingClientRect(); 
    const mouseX = e.clientX - rect.left; 
    const mouseY = e.clientY - rect.top; 

    if(!isDragging && catapultaActiva){catapultaActiva=false;}

    if(isDragging){ 
        document.body.style.cursor = "grabbing"; 
        if(catapultaActiva){
        let dx=mouseX-offsetX-pivoteCatapulta.x;let dy=mouseY-offsetY-pivoteCatapulta.y;let distancia=Math.hypot(dx,dy);
        if(distancia>maxArrastre){dx=(dx/distancia)*maxArrastre;dy=(dy/distancia)*maxArrastre;}
        axis.x=pivoteCatapulta.x+dx;axis.y=pivoteCatapulta.y+dy;
        } else {
        axis.x = mouseX - offsetX; 
        axis.y = mouseY - offsetY; 

        axis.x = Math.max(0, Math.min(mouseX - offsetX, 1450));
        axis.y = Math.max(0, Math.min(mouseY - offsetY, 650));
        }
    } else if(isDrawing){ 
 document.body.style.cursor = "crosshair"; 
        x2 = mouseX; 
        y2 = mouseY; 
    } 
    }
    
}) 

window.addEventListener("mouseup", (e) => { 
    if(gameloop){
if(isDragging){ 
        isDragging = false; 
        if(catapultaActiva){
        catapultaActiva=false;
        let deformaX=pivoteCatapulta.x-axis.x;let deformaY=pivoteCatapulta.y-axis.y;
        velocity.x=deformaX*k_elastica;velocity.y=deformaY*k_elastica;
        axis.x=pivoteCatapulta.x;axis.y=pivoteCatapulta.y;
        traj=[];
        ctx2.clearRect(0,0,1500,700);
        } else {
        velocity.x = 0; 
        }
    } else if(isDrawing){ 
        const rect = canvas.getBoundingClientRect(); 
 x2 = e.clientX - rect.left; 
     y2 = e.clientY - rect.top; 
        drawingPoints.push({x1:x1,y1:y1,x2:x2,y2:y2}); 
        console.log(drawingPoints); 
        isDrawing = false; 
    } 
    document.body.style.cursor = "default"; 
    }
    
}) 

function updateSpans(){ 
 span1.textContent = velocity.x.toFixed(2); 
    span2.textContent = velocity.y.toFixed(2); 

    span3.textContent = speed.toFixed(2); 

} 

function erasespans(){ 
span1.textContent = "0"; 
span2.textContent = "0"; 

    span3.textContent = "0"; 

} 
function drawGrid(){
    ctx.save();
let gridSize = 50;

    ctx.strokeStyle = "#1c1c1c";
   ctx.lineWidth = 1;

for(let x = 0; x <= 1500; x += gridSize){
ctx.beginPath();
     ctx.moveTo(x, 0);
        ctx.lineTo(x, 700);
        ctx.stroke();
    }

    for(let y = 0; y <= 700; y += gridSize){
        ctx.beginPath();
        ctx.moveTo(0, y);  ctx.lineTo(1500, y);
        ctx.stroke();
    }

    ctx.strokeStyle = "#7e7c7c";
ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.lineTo(1500, 350);ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(750, 0);
ctx.lineTo(750, 700);
ctx.stroke();

ctx.restore();
}
function gameloop(tActu){ 
    ctx.clearRect(0,0,1500,700); 
    drawGrid();
    input = document.getElementById("range"); 
    gravity.y = Number(input.value); 
    wind.x = Number(windinput.value) / 10;
    pressure.y = Number(pressureinput.value) / 10;
    if(velocity.x < 0){
        airResistance.x = Number(airresistanceinput.value) / 10;
    } else {
        airResistance.x = -Number(airresistanceinput.value) / 10;
    }
     if(velocity.y < 0){
        airResistance.y = Number(airresistanceinput.value) / 10;
    } else {
        airResistance.y = -Number(airresistanceinput.value) / 10;
    }
    if(!tAnt)tAnt=tActu; 
    let dt=(tActu-tAnt)/1000; 
    tAnt=tActu; 
    if(dt>0.1)dt=0.1; 

 update(dt) 
checkforcollission() 
updateSquash()
render()

newpos() 

drawingPursue() 

updateSpans() 
drawLive() 
drawCatapult()
drawPointsLOl() 


    if(running){ 

        requestAnimationFrame(gameloop) 
    } 
} 

let mode = "start" 

function start(){ 
    erasespans() 
    running=true; 
    startSelected = true;
document.getElementById("forces").classList.remove("simuoff");
document.getElementById("forces").classList.add("simon");
 velo=document.getElementById("velo") 
velocity.y=-Number(velo.value) 
 horizontal=document.getElementById("horizontal"); 
    velocity.x=Number(horizontal.value) 
    traj=[]; 
    ctx2.clearRect(0,0,1500,700); 
 drawingPoints=[] 
    tiempoAnterior=performance.now(); 
    requestAnimationFrame(gameloop); 
    button.textContent="stop"; 
 mode="stop"; 

} 


function stop(){ 
    erasespans() 
    startSelected = false;
         pauseMode="pause" 
 pause.textContent="pause" 
document.getElementById("forces").classList.remove("simon");
document.getElementById("forces").classList.add("simuoff");

    ctx.clearRect(0,0,1500,700); 
    drawGrid();
    running=false; 
   axis.y=100;axis.x=50;velocity.y=0;bounce=0.75; 
 velo=document.getElementById("velo") 
   velocity.y=-Number(velo.value);   horizontal=document.getElementById("horizontal"); 
    velocity.x=Number(horizontal.value) 
    mode="start"; 
    button.textContent="start" 
    render()

} 
function funcpause(){ 
    if(startSelected){
    running=false; 
    pauseMode="renaudar"; 
    pause.textContent="un-pause" 
    }

} 
function resumir(){ 
    if(startSelected){
            running=true; 
 pauseMode="pause" 
 pause.textContent="pause" 
    requestAnimationFrame(gameloop); 
        
    }

} 
button.onclick=function(){ 
    if(mode==="start"){ 
        start() 
    } else { 
     stop()     } 
} 
let pauseMode="pause" 
pause.onclick=function(){ 
if(pauseMode==="pause"){ 
   funcpause() 
    } else { 
 resumir() 
    } 
} 
function bounceCheck(){ 
    if(bounce===0){ 
        running=false; 
        return; 
    } 
}

let forces = []
function addForces(){
    forces = [];
if(windcheckbox.checked){
    forces.push({x:wind.x,y:wind.y})
}
if(pressureCheckbox.checked){
    forces.push({x:pressure.x,y:pressure.y})
}
if(airResistancebox.checked){
    forces.push({x:airResistance.x,y:airResistance.y})
}
gravity.y *= mass;
gravity.x *= mass;
forces.push({x:gravity.x,y:gravity.y})

    }

    let netforces = new Vector2(0,0)
    let acceleration = new Vector2(0,0)
function move(dt){ 
   addForces()
   let sumax =0;
   let sumay = 0;
 for(i = 0;i < forces.length;i++){
    sumax += forces[i].x;
    sumay += forces[i].y;
 }

 netforces.x = sumax;
 netforces.y = sumay;

    if(!isDragging){ 
      acceleration.x=netforces.x/mass;
     acceleration.y=netforces.y/mass; 

     velocity.x += acceleration.x;
velocity.y += acceleration.y;

     axis.x += velocity.x * dt* 60;
axis.y += velocity.y * dt * 60;
        dobounce(); 
    } 
 speed=Math.hypot(velocity.x, velocity.y); 
} 
function render(){

    ctx.fillStyle="#00d9ff";

    let cx=axis.x+25;
    let cy=axis.y+25;

    ctx.save();

    ctx.translate(cx,cy);

    let angle=0;

    if(Math.abs(velocity.x)>Math.abs(velocity.y)){
        angle=Math.atan2(velocity.y,velocity.x);
    }

    ctx.rotate(angle);

    ctx.scale(squashX,squashY);

    ctx.beginPath();
    ctx.arc(0,0,25,0,Math.PI*2);
    ctx.fill();

    ctx.restore();
}
function update(dt){ 
    move(dt) 
     
} 
let traj=[] 
function newpos(){ 
    traj.push({x:axis.x+25,y:axis.y+25}) 
}function drawTrajectory(){ 
    ctx2.strokeStyle = "#ff0000";
    ctx2.lineWidth = 3;
        
    traj.forEach((pos,index)=>{ 
        if(index===traj.length-1){return} 
ctx2.beginPath(); 
ctx2.moveTo(pos.x,pos.y); 
        ctx2.lineTo(traj[index+1].x,traj[index+1].y); 
  
        ctx2.stroke() 
    }) 
} 

function drawingPursue(){ 
    ctx2.strokeStyle = "#ff0000";
    ctx2.lineWidth = 3;
    if(drawing){ 
    drawTrajectory() 
    } else {   ctx2.clearRect(0,0,1500,700); 
    } 
} 

// hey hey this feature made me put a comment cause i hafta make it organized or else im geniunely cpooked 

/* 
im gonna paste ref code i did earlier that is similar to this. 
first im gonna think tho. 
when mousedown and its not dragging the cube i start another variable for drawing on the canvas, mousemove well stores 
last and first x y to draw the point from start x tp start y each bit u move, and mouseup to get out of it and add it onto an 
array this array will hold x1, y1, x2, y2 and every frame a function will be called to check if any of the four parts of the lil cube 
r in collision with whats been added to the cabvas, if so, bounce, im gonna make the bounce from move() another function cause theres 
no way im re writing allat, however idk if ill need to modify it a bit. drawing wont be another button cause thats geniuenly painful 
to make itll be from default. is this featture necessary? nah :). i gotta fillstyle red but that might periodically make the cube red. nah cause render gotta happen 
before the line renders. o its an event listener sooo thats hard, ig itll look skecthy however lemme get hands on it. 
*/

/* 
reference code:
document.addEventListener("mousedown", (e) => { 
    const rect = canvas.getBoundingClientRect(); 
    const mouseX = e.clientX - rect.left; 
    const mouseY = e.clientY - rect.top; 
   
    if(mouseX <= x+50 && mouseX >= x && mouseY <= y+50 && mouseY >= y){ 
        document.body.style.cursor = "grab" 
        offsetX = mouseX - x; 
        offsetY = mouseY - y; 
        isDragging = true; 
    } 
}) 

window.addEventListener("mousemove", (e) => { 
    if(isDragging){ 
        document.body.style.cursor = "grabbing" 
        const rect = canvas.getBoundingClientRect(); 
        const mouseX = e.clientX - rect.left; 
        const mouseY = e.clientY - rect.top; 
        x=mouseX-offsetX; 
        y=mouseY-offsetY; 
    } 
}) 

window.addEventListener("mouseup", () => { 
    if(isDragging){ 
        isDragging=false; 
        document.body.style.cursor="default"; 
        velocityX=0; 
    } 
}) 
*/

// i was gonna do that but realized it better to do it with one 

function drawPointsLOl(){  
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;

    drawingPoints.forEach((pos)=>{  
        ctx.beginPath();  
        ctx.moveTo(pos.x1,pos.y1);  
        ctx.lineTo(pos.x2,pos.y2);  
        ctx.stroke()  
    })
}

function drawCatapult(){ 
    if(!catapultaActiva){return}
    ctx.save();
ctx.strokeStyle = "#00ffcc";ctx.lineWidth = 4;
    ctx.beginPath();
 ctx.moveTo(pivoteCatapulta.x + 25, pivoteCatapulta.y + 25);
    ctx.lineTo(axis.x + 25, axis.y + 25);
    ctx.stroke();

    let fuerzaX = pivoteCatapulta.x - axis.x;let fuerzaY = pivoteCatapulta.y - axis.y;

    ctx.beginPath();
    ctx.moveTo(pivoteCatapulta.x + 25, pivoteCatapulta.y + 25);
ctx.lineTo(pivoteCatapulta.x + 25 + fuerzaX, pivoteCatapulta.y + 25 + fuerzaY);
    ctx.stroke();

    let fuerzaTotal = (Math.hypot(fuerzaX, fuerzaY) * k_elastica).toFixed(1);
    let anguloRadianes = Math.atan2(-fuerzaY, fuerzaX);
    let anguloGrados = ((anguloRadianes * 180) / Math.PI).toFixed(0);
    if(anguloGrados < 0) anguloGrados = (360 + parseFloat(anguloGrados)).toFixed(0);

    ctx.fillStyle = "#00ffcc";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`Strength: ${fuerzaTotal}`, pivoteCatapulta.x - 48, pivoteCatapulta.y - 48);
    ctx.fillText(`Angle: ${anguloGrados} deg`, pivoteCatapulta.x - 48, pivoteCatapulta.y - 30);

    ctx.restore();
}

function drawLive(){ 
        ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    if(isDrawing){ 
        ctx.beginPath(); 
        ctx.moveTo(x1,y1); 
 ctx.lineTo(x2,y2); 
        ctx.stroke(); 
    } 
}

function dobounce(){    
    
    if(axis.y>=650){      
        axis.y=650;            
  
        if(Math.abs(velocity.y) < 0.9){    
  
            velocity.y = 0;   
            velocity.x *= 0.9;   
  
            if(Math.abs(velocity.x) < 0.05){    
                velocity.x=0;   
            }   
  
        }else {  

            let impacto = Math.abs(velocity.y);

            let squash = Math.min(1.2, 1 + impacto * 0.025);
            let stretch = 1 / squash;

            impactSquash(squash, stretch);

            velocity.y = -velocity.y * bounce;   
            velocity.x *= 0.95; 
        }    
    }   
  
    topwall=0;    
  
    if(axis.y<0){     
        axis.y=topwall;     
  
        if(velocity.y<0){     

            let impacto = Math.abs(velocity.y);

            let squash = Math.min(1.2, 1 + impacto * 0.025);
            let stretch = 1 / squash;

            impactSquash(squash, stretch);

            velocity.y=-velocity.y*bounce;     
        }     
    }   
  
    rightwall=1450;     
  
    if(axis.x>=rightwall){      
        axis.x=rightwall;      
  
        let impacto = Math.abs(velocity.x);

        let squash = Math.min(1.2, 1 + impacto * 0.025);
        let stretch = 1 / squash;

        impactSquash(stretch, squash);

        velocity.x=-velocity.x*bounce;      
    }   
  
    leftwall=0;     
  
    if(axis.x<=leftwall){      
        axis.x=leftwall;      
  
        let impacto = Math.abs(velocity.x);

        let squash = Math.min(1.2, 1 + impacto * 0.025);
        let stretch = 1 / squash;

        impactSquash(stretch, squash);

        velocity.x=-velocity.x*bounce;      
    }   
}
function checkforcollission(){

    drawingPoints.forEach((line)=>{

        let dx = line.x2-line.x1;
        let dy = line.y2-line.y1;
        let len = Math.hypot(dx,dy);

        if(len===0){return}

        let cx = axis.x+25;
        let cy = axis.y+25;

        let px = cx-line.x1;
        let py = cy-line.y1;

        let t = (px*dx+py*dy)/(len*len);

        if(t<0)t=0;
        if(t>1)t=1;

        let closestX = line.x1+dx*t;
        let closestY = line.y1+dy*t;

        let distX = cx-closestX;
       let distY = cy-closestY;

        let dist = Math.hypot(distX,distY);

        if(dist<=25){

 if(dist===0){return}

            let normalX = distX/dist;
            let normalY = distY/dist;

            let velocityNormal =
 velocity.x*normalX +
        velocity.y*normalY;



         if(velocityNormal < 0){

        
 let impactSpeed = Math.abs(velocityNormal);
            let push = 25-dist; axis.x += normalX*push;
                axis.y += normalY*push;


                if(impactSpeed < 1){

                    velocity.x = 0;
                    velocity.y = 0;

                }


                else{

                    velocity.x =
                   velocity.x -
                        2*velocityNormal*normalX;

          velocity.y =
                 velocity.y -
                        2*velocityNormal*normalY;

         velocity.x *= bounce;
                    velocity.y *= bounce;

                }

            }

     
            else{

                let push = 25-dist;
                if(push > 0){

                    axis.x += normalX*push;
                    axis.y += normalY*push;

                }

            }

        }

    });

}

drawGrid()
stop()
function impactSquash(x, y){  

    impactSquashX = x;
    impactSquashY = y;

    squashTimer = squashDuration;  

}
function updateSquash(){

    if(squashTimer>0){
     squashTimer--;
     let fuerza=squashTimer/squashDuration;

     targetSquashX=1+(impactSquashX-1)*fuerza;
 targetSquashY=1+(impactSquashY-1)*fuerza;

    }else{

      let vel=Math.hypot(velocity.x,velocity.y);

        if(!isDragging && vel>0.5){
            let stretch=Math.min(1.08,1+vel*0.008);

         if(Math.abs(velocity.x)>Math.abs(velocity.y)){

                targetSquashX=stretch;
            targetSquashY=1/stretch;

         }else{

     targetSquashX=1/stretch;
                targetSquashY=stretch;

            }

        }else{

            targetSquashX=1;
            targetSquashY=1;

        }
    }

    squashX+=(targetSquashX-squashX)*0.12;
    squashY+=(targetSquashY-squashY)*0.12;
}

const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobileOrTablet) {
    window.location.href = "/desktop-only.html";
}