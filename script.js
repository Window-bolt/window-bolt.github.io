/* ---------- LOGIN ---------- */
if (localStorage.getItem("user")) showApp();

function login() {
  const name = document.getElementById("username").value;
  if (!name) return alert("Enter name");
  localStorage.setItem("user", name);
  showApp();
}

function showApp() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("welcome").innerText =
    "Welcome, " + localStorage.getItem("user");
}

function logout() {
  localStorage.removeItem("user");
  location.reload();
}

/* ---------- FIRE GAME ---------- */
let fireCount = 0, timeLeft = 10, fireTimer, spawnTimer;

function startFireGame() {
  fireCount = 0;
  timeLeft = 10;
  document.getElementById("fireGame").innerHTML = "";
  updateFireInfo();

  fireTimer = setInterval(() => {
    timeLeft--;
    updateFireInfo();
    if (timeLeft <= 0) endFireGame();
  }, 1000);

  spawnTimer = setInterval(spawnFire, 700);
}

function spawnFire() {
  const game = document.getElementById("fireGame");
  const fire = document.createElement("div");
  fire.className = "fire";
  fire.innerHTML = "🔥";
  fire.style.left = Math.random()*90+"%";
  fire.style.top = Math.random()*80+"%";

  fire.onclick = () => {
    fire.remove();
    fireCount++;
    updateFireInfo();
  };

  game.appendChild(fire);
}

function updateFireInfo() {
  document.getElementById("fireInfo").innerText =
    `Time: ${timeLeft} | Extinguished: ${fireCount} / 5`;
}

function endFireGame() {
  clearInterval(fireTimer);
  clearInterval(spawnTimer);
  alert(fireCount >= 5 ? "✅ You Win!" : "❌ Game Over!");
}

/* ---------- FLAPPY GAME ---------- */
const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");
let bird, pipes, gravity, loop;

function startFlappy() {
  bird = { x: 50, y: 200, v: 0 };
  pipes = [];
  gravity = 0.6;
  clearInterval(loop);
  loop = setInterval(updateFlappy, 30);
  document.onclick = () => bird.v = -8;
}

function updateFlappy() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  bird.v += gravity;
  bird.y += bird.v;
  ctx.font = "30px Arial";
  ctx.fillText("🐦", bird.x, bird.y);

  if (!pipes.length || pipes[pipes.length-1].x < 200) {
    pipes.push({
      x: canvas.width,
      gap: 120,
      top: Math.random()*150+20
    });
  }

  pipes.forEach(p => {
    p.x -= 3;
    ctx.fillStyle = "green";
    ctx.fillRect(p.x,0,40,p.top);
    ctx.fillRect(p.x,p.top+p.gap,40,canvas.height);
    ctx.fillText("🔥",p.x+5,p.top+p.gap/2);

    if (bird.x>p.x && bird.x<p.x+40 &&
       (bird.y<p.top || bird.y>p.top+p.gap))
      gameOver();
  });

  if (bird.y>canvas.height || bird.y<0) gameOver();
}

function gameOver() {
  clearInterval(loop);
  alert("❌ Game Over!");
}
