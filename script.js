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

/* MAP */
let map, fireLayer;

function initMap(){
  if(map) return;

  map = L.map("map").setView([20,0],2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  fireLayer = L.tileLayer(
    "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Thermal_Anomalies_24h/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
    {opacity:0.8}
  ).addTo(map);
}

function toggleFires(){
  fireLayer.setOpacity(fireLayer.options.opacity ? 0 : 0.8);
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
  fireResult.innerText = fireScore>=5 ? "YOU WIN" : "GAME OVER";
}

/* FLAPPY */
const c=game, ctx=c.getContext("2d");
let bird, pipes, loop;
let score=0, best=localStorage.best||0;

function startFlappy(){
  bird={x:50,y:180,v:0};
  pipes=[];
  score=0;
  document.onclick=()=>bird.v=-7;
  clearInterval(loop);
  loop=setInterval(update,30);
}

function update(){
  ctx.clearRect(0,0,300,360);

  bird.v+=0.5;
  bird.y+=bird.v;
  ctx.fillText("💧",bird.x,bird.y);

  if(!pipes.length||pipes[pipes.length-1].x<180)
    pipes.push({x:300,top:Math.random()*120+40,gap:150,passed:false});

  pipes.forEach(p=>{
    p.x-=3;
    ctx.fillStyle="#c62828";
    ctx.fillRect(p.x,0,40,p.top);
    ctx.fillRect(p.x,p.top+p.gap,40,360);

    if(!p.passed && p.x<bird.x){
      score++;
      p.passed=true;
    }

    if(bird.x>p.x && bird.x<p.x+40 &&
      (bird.y<p.top||bird.y>p.top+p.gap)) end();
  });

  if(bird.y<0||bird.y>360) end();

  flappyInfo.innerText=`Score: ${score} | Best: ${best}`;
}

function end(){
  clearInterval(loop);
  if(score>best){
    best=score;
    localStorage.best=best;
  }
  alert("Game Over");
  }
