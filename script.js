/* LOGIN */
function signup(){
  if(!user.value||!pass.value) return alert("Fill all fields");
  localStorage.setItem(user.value,pass.value);
  alert("Account created");
}

function login(){
  if(localStorage.getItem(user.value)!==pass.value)
    return alert("Wrong login");
  loginScreen.style.display="none";
  app.style.display="block";
  initMap();
}

function logout(){location.reload()}

/* REAL FIRE MAP */
let map, fireLayer, fireVisible=true;

function initMap(){
  if(map) return;
  map = L.map("map").setView([20,0],2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    maxZoom:18
  }).addTo(map);

  fireLayer = L.tileLayer(
    "https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/MapServer/tile/{z}/{y}/{x}",
    {opacity:0.7}
  ).addTo(map);
}

function toggleFires(){
  fireVisible=!fireVisible;
  fireLayer.setOpacity(fireVisible?0.7:0);
}

/* FIRE GAME */
let fireScore=0, fireBest=localStorage.fireBest||0;
let fireTime, spawn, timer;

function startFireGame(){
  fireScore=0;
  fireTime=10;
  fireArea.innerHTML="";
  fireResult.innerText="";
  updateFire();

  timer=setInterval(()=>{
    fireTime--;
    updateFire();
    if(fireTime<=0) endFire();
  },1000);

  spawn=setInterval(()=>{
    const f=document.createElement("div");
    f.className="fire";
    f.innerText="🔥";
    f.style.left=Math.random()*85+"%";
    f.style.top=Math.random()*75+"%";
    f.onclick=()=>{
      fireScore++;
      f.remove();
      updateFire();
    };
    fireArea.appendChild(f);
  },700);
}

function updateFire(){
  fireInfo.innerText=`Score: ${fireScore} | Best: ${fireBest} | Time: ${fireTime}`;
}

function endFire(){
  clearInterval(spawn);
  clearInterval(timer);
  if(fireScore>fireBest){
    fireBest=fireScore;
    localStorage.fireBest=fireBest;
  }
  fireResult.innerText = fireScore>=5 ? "✅ YOU WIN!" : "❌ GAME OVER";
  updateFire();
}

/* FLAPPY BIRD (NO FIRE EMOJI) */
const c=game, ctx=c.getContext("2d");
let bird, pipes, flappyLoop;
let flappyScore=0, flappyBest=localStorage.flappyBest||0;

function startFlappy(){
  bird={x:50,y:180,v:0};
  pipes=[];
  flappyScore=0;
  updateFlappyInfo();
  clearInterval(flappyLoop);

  document.onclick=()=>bird.v=-7;
  flappyLoop=setInterval(updateFlappy,30);
}

function updateFlappy(){
  ctx.clearRect(0,0,300,360);

  bird.v+=0.5;
  bird.y+=bird.v;
  ctx.font="26px Arial";
  ctx.fillText("💧",bird.x,bird.y);

  if(!pipes.length||pipes[pipes.length-1].x<160)
    pipes.push({x:300,top:Math.random()*100+40,gap:140,passed:false});

  pipes.forEach(p=>{
    p.x-=3;
    ctx.fillStyle="#c62828";
    ctx.fillRect(p.x,0,40,p.top);
    ctx.fillRect(p.x,p.top+p.gap,40,360);

    if(!p.passed && p.x+40<bird.x){
      flappyScore++;
      p.passed=true;
      updateFlappyInfo();
    }

    if(bird.x>p.x && bird.x<p.x+40 &&
      (bird.y<p.top||bird.y>p.top+p.gap)) endFlappy();
  });

  if(bird.y<0||bird.y>360) endFlappy();
}

function updateFlappyInfo(){
  flappyInfo.innerText=`Score: ${flappyScore} | Best: ${flappyBest}`;
}

function endFlappy(){
  clearInterval(flappyLoop);
  if(flappyScore>flappyBest){
    flappyBest=flappyScore;
    localStorage.flappyBest=flappyBest;
  }
  updateFlappyInfo();
  alert("Game Over");
}
