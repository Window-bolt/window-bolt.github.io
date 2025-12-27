/* ===== LOGIN SYSTEM ===== */
function checkLogin() {
  const loggedIn = localStorage.getItem("hydroLoggedIn");
  const user = localStorage.getItem("hydroUser");

  document.querySelectorAll(".protected").forEach(sec => {
    sec.style.display = loggedIn === "true" ? "block" : "none";
  });

  document.getElementById("loginNotice").innerText =
    loggedIn === "true" ? "Logged in as " + user + " ✅" : "Login required 🔒";
}

function signup() {
  const u = username.value;
  const p = password.value;
  if (!u || !p) return alert("Fill all fields");
  localStorage.setItem("hydroUser", u);
  localStorage.setItem("hydroPass", p);
  authStatus.innerText = "Sign up successful!";
}

function login() {
  if (username.value === localStorage.getItem("hydroUser") &&
      password.value === localStorage.getItem("hydroPass")) {
    localStorage.setItem("hydroLoggedIn", "true");
    authStatus.innerText = "Welcome 👋";
    checkLogin();
  } else authStatus.innerText = "Wrong details";
}

function logout() {
  localStorage.setItem("hydroLoggedIn", "false");
  checkLogin();
}

/* ===== MAP ===== */
function setNormalMap() {
  mapFrame.src = "https://www.google.com/maps?q=India&z=5&output=embed";
}
function setSatelliteMap() {
  mapFrame.src = "https://www.google.com/maps?t=k&q=India&z=5&output=embed";
}
function showMyLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    mapFrame.src =
      `https://www.google.com/maps?t=k&q=${pos.coords.latitude},${pos.coords.longitude}&z=15&output=embed`;
  });
}

/* ===== FIRE ALERT ===== */
function checkFireAlert() {
  alert("Check red fire spots on the fire map near your location.");
}

/* ===== FIRE CLICK GAME ===== */
let fireScore = 0, fireInterval;

function startFireGame() {
  fireScore = 0;
  fireScoreSpan = document.getElementById("fireScore");
  fireScoreSpan.innerText = 0;
  gameArea.innerHTML = "";

  fireInterval = setInterval(() => {
    const f = document.createElement("div");
    f.className = "fire";
    f.innerText = "🔥";
    f.style.left = Math.random()*260+"px";
    f.style.top = Math.random()*210+"px";
    f.onclick = () => {
      f.remove();
      fireScore++;
      fireScoreSpan.innerText = fireScore;
    };
    gameArea.appendChild(f);
    setTimeout(()=>f.remove(),3000);
  },800);

  setTimeout(()=>clearInterval(fireInterval),20000);
}

/* ===== FLAPPY GAME ===== */
let ctx, birdY, birdV, pipes, loop;

function startFlappy() {
  ctx = flappyCanvas.getContext("2d");
  birdY = 200;
  birdV = 0;
  pipes = [{x:320}];

  clearInterval(loop);
  loop = setInterval(updateFlappy,30);

  document.onclick = ()=>birdV = -6;
}

function updateFlappy() {
  ctx.clearRect(0,0,320,400);
  birdV += 0.4;
  birdY += birdV;
  ctx.font="28px Arial";
  ctx.fillText("💧🐦",50,birdY);

  pipes.forEach(p=>{
    p.x -= 2;
    ctx.fillText("🔥",p.x,0);
    ctx.fillText("🔥",p.x,360);
    if(p.x<0){p.x=320;}
    if(p.x<80 && p.x>40 && (birdY<40 || birdY>360)) endFlappy();
  });

  if(birdY<0||birdY>400) endFlappy();
}

function endFlappy() {
  clearInterval(loop);
  alert("Game Over!");
}

window.onload = checkLogin;
