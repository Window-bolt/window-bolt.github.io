/* AUTH */
function signup(){
  if(!authUser.value||!authPass.value) return alert("Fill all fields");
  localStorage.setItem(authUser.value,authPass.value);
  alert("Account created");
}

function login(){
  if(localStorage.getItem(authUser.value)!==authPass.value)
    return alert("Invalid login");
  authScreen.style.display="none";
  dashboard.style.display="block";
  initMap();
}

function logout(){location.reload()}

/* FIRE MAP */
let map;
function initMap(){
  if(map) return;
  map=L.map("map").setView([20.5937,78.9629],5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  const fires=[
    [28.61,77.20],
    [19.07,72.87],
    [13.08,80.27],
    [22.57,88.36]
  ];
  fires.forEach(f=>{
    L.marker(f).addTo(map).bindPopup("🔥 Fire detected");
  });
}

/* FIRE GAME */
let fireCount,timeLeft,spawn,timer;

function startFireGame(){
  clearInterval(spawn);clearInterval(timer);
  fireCount=0;timeLeft=10;
  fireArea.innerHTML="";
  updateFire();

  timer=setInterval(()=>{
    timeLeft--;updateFire();
    if(timeLeft<=0) endFire();
  },1000);

  spawn=setInterval(()=>{
    const f=document.createElement("div");
    f.className="fire";f.innerText="🔥";
    f.style.left=Math.random()*90+"%";
    f.style.top=Math.random()*80+"%";
    f.onclick=()=>{f.remove();fireCount++;updateFire()};
    fireArea.appendChild(f);
  },700);
}

function updateFire(){
  fireText.innerText=`Time: ${timeLeft} | Fires: ${fireCount} / 5`;
}

function endFire(){
  clearInterval(spawn);clearInterval(timer);
  alert(fireCount>=5?"YOU WIN":"GAME OVER");
}

/* FLAPPY */
const c=flappy,ctx=c.getContext("2d");
let bird,pipes,loop;

function startFlappy(){
  bird={x:50,y:150,v:0};
  pipes=[];
  clearInterval(loop);
  loop=setInterval(updateFlappy,30);
  document.onclick=()=>bird.v=-7;
}

function updateFlappy(){
  ctx.clearRect(0,0,300,350);
  bird.v+=0.5;bird.y+=bird.v;
  ctx.font="26px Arial";ctx.fillText("💧",bird.x,bird.y);

  if(!pipes.length||pipes[pipes.length-1].x<180)
    pipes.push({x:300,top:Math.random()*120+40,gap:120});

  pipes.forEach(p=>{
    p.x-=3;
    ctx.fillStyle="green";
    ctx.fillRect(p.x,0,40,p.top);
    ctx.fillRect(p.x,p.top+p.gap,40,350);
    ctx.fillText("🔥",p.x+8,p.top+p.gap/2);

    if(bird.x>p.x&&bird.x<p.x+40 &&
      (bird.y<p.top||bird.y>p.top+p.gap)) gameOver();
  });

  if(bird.y<0||bird.y>350) gameOver();
}

function gameOver(){
  clearInterval(loop);
  alert("Flappy Game Over");
}
