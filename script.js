/* LOGIN */
function login() {
  const name = document.getElementById("username").value;
  if (!name) return alert("Enter name");
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  initMap();
}

function logout() {
  location.reload();
}

/* MAP */
function initMap() {
  const map = L.map('map').setView([20.5937,78.9629],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  [[28.6,77.2],[19.0,72.8],[13.0,80.2]].forEach(f=>{
    L.marker(f).addTo(map).bindPopup("🔥 Fire (Demo)");
  });
}

/* FIRE GAME */
let time = 10, fires = 0, fireInterval, timer;

function startFireGame() {
  fires = 0;
  time = 10;
  document.getElementById("fireGame").innerHTML = "";
  updateFireText();

  timer = setInterval(()=>{
    time--;
    updateFireText();
    if(time<=0) endFire();
  },1000);

  fireInterval = setInterval(spawnFire,700);
}

function spawnFire() {
  const fire = document.createElement("div");
  fire.className="fire";
  fire.innerHTML="🔥";
  fire.style.left=Math.random()*90+"%";
  fire.style.top=Math.random()*80+"%";
  fire.onclick=()=>{
    fire.remove();
    fires++;
    updateFireText();
  }
  document.getElementById("fireGame").appendChild(fire);
}

function updateFireText(){
  document.getElementById("fireInfo").innerText=
  `Time: ${time} | Fires: ${fires} / 5`;
}

function endFire(){
  clearInterval(timer);
  clearInterval(fireInterval);
  alert(fires>=5 ? "You Win 🔥💧" : "Game Over ❌");
}

/* FLAPPY */
const c = document.getElementById("flappy");
const ctx = c.getContext("2d");
let bird, pipes, loop;

function startFlappy(){
  bird={x:50,y:150,v:0};
  pipes=[];
  clearInterval(loop);
  loop=setInterval(updateFlappy,30);
  document.onclick=()=>bird.v=-7;
}

function updateFlappy(){
  ctx.clearRect(0,0,c.width,c.height);
  bird.v+=0.5;
  bird.y+=bird.v;
  ctx.font="28px Arial";
  ctx.fillText("🐦",bird.x,bird.y);

  if(!pipes.length||pipes[pipes.length-1].x<200)
    pipes.push({x:300,gap:120,top:Math.random()*140+20});

  pipes.forEach(p=>{
    p.x-=3;
    ctx.fillStyle="#004d40";
    ctx.fillRect(p.x,0,40,p.top);
    ctx.fillRect(p.x,p.top+p.gap,40,400);
    ctx.fillText("🔥",p.x+8,p.top+p.gap/2);
    if(bird.x>p.x&&bird.x<p.x+40&&(bird.y<p.top||bird.y>p.top+p.gap)) gameOver();
  });

  if(bird.y<0||bird.y>400) gameOver();
}

function gameOver(){
  clearInterval(loop);
  alert("Flappy Game Over ❌");
}
