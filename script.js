/* LOGIN SYSTEM */
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

/* FIRE MAP */
let map;
function initMap(){
  if(map) return;
  map=L.map("map").setView([20.6,78.9],5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  [[28,77],[19,72],[13,80],[22,88]].forEach(f=>{
    L.marker(f).addTo(map).bindPopup("🔥 Fire detected");
  });
}

/* FIRE GAME */
let timeLeft,fireCount,spawn,timer;

function startFireGame(){
  clearInterval(spawn);clearInterval(timer);
  fireArea.innerHTML="";
  timeLeft=10;fireCount=0;
  updateFire();

  timer=setInterval(()=>{
    timeLeft--;updateFire();
    if(timeLeft<=0) endFire();
  },1000);

  spawn=setInterval(()=>{
    const f=document.createElement("div");
    f.className="fire";
    f.innerText="🔥";
    f.style.left=Math.random()*85+"%";
    f.style.top=Math.random()*75+"%";
    f.onclick=()=>{f.remove();fireCount++;updateFire()};
    fireArea.appendChild(f);
  },700);
}

function updateFire(){
  fireStatus.innerText=`Time: ${timeLeft} | Fires: ${fireCount} / 5`;
}

function endFire(){
  clearInterval(spawn);clearInterval(timer);
  alert(fireCount>=5?"YOU WIN":"GAME OVER");
}

/* FLAPPY BIRD */
const c=game,ctx=c.getContext("2d");
let bird,pipes,loop;

function startFlappy(){
  bird={x:50,y:180,v:0};
  pipes=[];
  clearInterval(loop);
  loop=setInterval(updateFlappy,30);
  document.onclick=()=>bird.v=-7;
}

function updateFlappy(){
  ctx.clearRect(0,0,300,360);
  bird.v+=0.5;bird.y+=bird.v;
  ctx.font="26px Arial";
  ctx.fillText("💧",bird.x,bird.y);

  if(!pipes.length||pipes[pipes.length-1].x<160)
    pipes.push({x:300,top:Math.random()*100+40,gap:140});

  pipes.forEach(p=>{
    p.x-=3;
    ctx.fillStyle="green";
    ctx.fillRect(p.x,0,40,p.top);
    ctx.fillRect(p.x,p.top+p.gap,40,360);
    ctx.fillText("🔥",p.x+8,p.top+p.gap/2);

    if(bird.x>p.x&&bird.x<p.x+40 &&
      (bird.y<p.top||bird.y>p.top+p.gap)) gameOver();
  });

  if(bird.y<0||bird.y>360) gameOver();
}

function gameOver(){
  clearInterval(loop);
  alert("Game Over");
}
