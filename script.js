/* LOGIN */
function login() {
  const name = document.getElementById("username").value.trim();
  if (!name) {
    alert("Enter your name");
    return;
  }
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

function logout() {
  location.reload();
}

/* FIRE GAME */
let fireCount = 0;
let timeLeft = 10;
let fireTimer, spawnTimer;

function startFireGame() {
  fireCount = 0;
  timeLeft = 10;
  document.getElementById("fireArea").innerHTML = "";
  updateFireText();

  fireTimer = setInterval(() => {
    timeLeft--;
    updateFireText();
    if (timeLeft <= 0) endFireGame();
  }, 1000);

  spawnTimer = setInterval(spawnFire, 700);
}

function spawnFire() {
  const fire = document.createElement("div");
  fire.className = "fire";
  fire.innerText = "🔥";
  fire.style.left = Math.random() * 90 + "%";
  fire.style.top = Math.random() * 80 + "%";
  fire.onclick = () => {
    fire.remove();
    fireCount++;
    updateFireText();
  };
  document.getElementById("fireArea").appendChild(fire);
}

function updateFireText() {
  document.getElementById("fireText").innerText =
    `Time: ${timeLeft} | Fires: ${fireCount} / 5`;
}

function endFireGame() {
  clearInterval(fireTimer);
  clearInterval(spawnTimer);
  alert(fireCount >= 5 ? "You Win!" : "Game Over!");
}

/* FLAPPY */
const canvas = document.getElementById("flappy");
const ctx = canvas.getContext("2d");
let bird, pipes, gameLoop;

function startFlappy() {
  bird = { x: 50, y: 150, v: 0 };
  pipes = [];
  clearInterval(gameLoop);
  gameLoop = setInterval(updateFlappy, 30);
  document.onclick = () => bird.v = -7;
}

function updateFlappy() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  bird.v += 0.5;
  bird.y += bird.v;
  ctx.font = "28px Arial";
  ctx.fillText("🐦", bird.x, bird.y);

  if (!pipes.length || pipes[pipes.length-1].x < 200) {
    pipes.push({ x: 300, gap: 120, top: Math.random()*140 + 20 });
  }

  pipes.forEach(p => {
    p.x -= 3;
    ctx.fillStyle = "#004d40";
    ctx.fillRect(p.x, 0, 40, p.top);
    ctx.fillRect(p.x, p.top + p.gap, 40, 400);
    ctx.fillText("🔥", p.x+8, p.top + p.gap/2);
    if (bird.x > p.x && bird.x < p.x+40 &&
        (bird.y < p.top || bird.y > p.top + p.gap)) gameOver();
  });

  if (bird.y < 0 || bird.y > canvas.height) gameOver();
}

function gameOver() {
  clearInterval(gameLoop);
  alert("Flappy Game Over");
}
