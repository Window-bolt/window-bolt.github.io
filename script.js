document.addEventListener("DOMContentLoaded", () => {

  /* ---------- LOGIN ---------- */
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  loginBtn.onclick = () => {
    const name = document.getElementById("username").value;
    if(!name) return alert("Enter your name");
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("welcome").innerText = "Welcome, " + name;
    initMap(); // initialize map when logged in
  };

  logoutBtn.onclick = () => {
    document.getElementById("app").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
  };

  /* ---------- FIRE GAME ---------- */
  let fireCount = 0, timeLeft = 10, fireTimer, spawnTimer;

  const fireGame = document.getElementById("fireGame");
  const fireInfo = document.getElementById("fireInfo");

  document.getElementById("startFire").onclick = () => {
    fireCount = 0;
    timeLeft = 10;
    fireGame.innerHTML = "";
    updateFireInfo();

    fireTimer = setInterval(() => {
      timeLeft--;
      updateFireInfo();
      if(timeLeft <= 0) endFireGame();
    }, 1000);

    spawnTimer = setInterval(spawnFire, 700);
  };

  function spawnFire() {
    if(timeLeft <= 0) return;

    const fire = document.createElement("div");
    fire.className = "fire";
    fire.innerHTML = "🔥";
    fire.style.left = Math.random()*90 + "%";
    fire.style.top = Math.random()*80 + "%";

    fire.onclick = () => {
      fire.remove();
      fireCount++;
      updateFireInfo();
    };

    fireGame.appendChild(fire);
  }

  function updateFireInfo() {
    fireInfo.innerText = `Time: ${timeLeft} | Fires: ${fireCount} / 5`;
  }

  function endFireGame() {
    clearInterval(fireTimer);
    clearInterval(spawnTimer);
    alert(fireCount >= 5 ? "✅ You Win!" : "❌ Game Over!");
  }

  /* ---------- FLAPPY FIRE BIRD ---------- */
  const canvas = document.getElementById("flappy");
  const ctx = canvas.getContext("2d");
  let bird, pipes, gravity, loop;

  document.getElementById("startFlappy").onclick = () => {
    bird = {x:50, y:200, v:0};
    pipes = [];
    gravity = 0.6;
    clearInterval(loop);
    loop = setInterval(updateFlappy, 30);
    document.onclick = () => bird.v = -8;
  };

  function updateFlappy() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    bird.v += gravity;
    bird.y += bird.v;

    ctx.font = "30px Arial";
    ctx.fillText("🐦", bird.x, bird.y);

    if(!pipes.length || pipes[pipes.length-1].x < 200){
      pipes.push({x: canvas.width, gap:120, top: Math.random()*150 + 20});
    }

    pipes.forEach(p => {
      p.x -= 3;
      ctx.fillStyle = "green";
      ctx.fillRect(p.x, 0, 40, p.top);
      ctx.fillRect(p.x, p.top + p.gap, 40, canvas.height);
      ctx.fillText("🔥", p.x+5, p.top + p.gap/2);

      if(bird.x > p.x && bird.x < p.x+40 &&
        (bird.y < p.top || bird.y > p.top+p.gap)) gameOver();
    });

    if(bird.y > canvas.height || bird.y < 0) gameOver();
  }

  function gameOver() {
    clearInterval(loop);
    alert("❌ Game Over!");
  }

  /* ---------- FIRE MAP ---------- */
  function initMap() {
    const map = L.map('map').setView([20.5937,78.9629],5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Demo fire markers
    const fires = [
      [28.61,77.20],
      [19.07,72.87],
      [13.08,80.27]
    ];
    fires.forEach(f => L.marker(f).addTo(map).bindPopup("🔥 Fire (Demo)"));
  }

});
