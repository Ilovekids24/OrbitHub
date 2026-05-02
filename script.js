let page = "home";

/* =========================
   🎮 GAMES
========================= */
const games = [
  {
    name: "Cookie Clicker",
    url: "https://unblocked-cookie-clicker.pages.dev/"
  }
];

/* =========================
   🌌 ENTER CINEMATIC SEQUENCE
========================= */
function enterSite() {
  startWarp();

  const welcome = document.getElementById("welcome");

  welcome.style.transition = "opacity 1s ease, transform 1s ease, filter 1s ease";
  welcome.style.opacity = "0";
  welcome.style.transform = "scale(1.1)";
  welcome.style.filter = "blur(20px)";

  /* PHASE 1 → warp runs longer for buildup */
  setTimeout(() => {
    cinematicWhiteSequence();
  }, 1200);
}

/* =========================
   🎬 CINEMATIC CONTROLLER (3 PHASES)
========================= */
function cinematicWhiteSequence() {

  const overlay = document.createElement("div");

  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "9999";
  overlay.style.background = "white";

  /* start fully invisible */
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 2.5s ease";

  document.body.appendChild(overlay);

  /* =========================
     PHASE 2 → SLOW BUILD TO WHITE (NO FLASH)
  ========================= */
  requestAnimationFrame(() => {
    overlay.style.opacity = "0.15";
  });

  setTimeout(() => {
    overlay.style.opacity = "0.45";
  }, 600);

  setTimeout(() => {
    overlay.style.opacity = "0.75";
  }, 1200);

  /* =========================
     PHASE 3 → FULL WHITE PEAK (IMPORTANT)
  ========================= */
  setTimeout(() => {

    overlay.style.transition = "opacity 1.2s ease";
    overlay.style.opacity = "1"; // FULL WHITE LOCK

    /* kill warp EXACTLY at peak */
    hardStopWarp();

    document.getElementById("welcome").style.display = "none";
    document.getElementById("app").style.display = "block";

    render();

  }, 1800);

  /* =========================
     PHASE 4 → FADE BACK INTO SPACE
  ========================= */
  setTimeout(() => {

    overlay.style.transition = "opacity 2s ease, filter 2s ease";
    overlay.style.opacity = "0";
    overlay.style.filter = "blur(30px)";

    setTimeout(() => {
      overlay.remove();
      enableCalmStars();
    }, 2100);

  }, 3000);
}

/* =========================
   🚀 HARD STOP WARP (CLEAN CUT)
========================= */
function hardStopWarp() {
  warpOn = false;

  wctx.clearRect(0, 0, warp.width, warp.height);

  stars.forEach(s => {
    s.z = warp.width;
  });
}

/* =========================
   🌌 NAV
========================= */
function route(p) {
  page = p;
  render();
  if (p === "home") renderHomeIcons();
}

/* =========================
   🎮 SEARCH
========================= */
function handleSearch() {
  let q = document.getElementById("searchInput").value.toLowerCase();
  if (q.includes("cookie")) openGame(games[0]);
}

/* =========================
   🎮 GAME SYSTEM
========================= */
function openGame(game) {
  const p = document.getElementById("playmode");
  p.style.display = "block";

  document.getElementById("gameFrame").src = game.url;
  document.getElementById("gameTitle").innerText = game.name;
}

function exitGame() {
  document.getElementById("playmode").style.display = "none";
  document.getElementById("gameFrame").src = "";
}

/* =========================
   🧠 RENDER SYSTEM
========================= */
function render() {
  const v = document.getElementById("view");

  if (page === "home") {
    v.innerHTML = `<h2>🏠 Home</h2>`;
    renderHomeIcons();
  }

  if (page === "games") {
    v.innerHTML = `
      <h2>🎮 Games</h2>
      <div class="game-grid">
        ${games.map(g => `
          <div class="game" onclick='openGame(${JSON.stringify(g)})'>
            ${g.name}
          </div>
        `).join("")}
      </div>
    `;
  }

  if (page === "search") v.innerHTML = `<h2>🔍 Search</h2>`;
  if (page === "about") v.innerHTML = `<h2>ℹ About</h2>`;
}

/* =========================
   🏠 HOME ICONS
========================= */
function renderHomeIcons() {
  const box = document.getElementById("homeIcons");
  if (!box) return;

  box.innerHTML = `
    <div class="icon" onclick="route('games')">🎮</div>
    <div class="icon" onclick="route('search')">🔍</div>
    <div class="icon" onclick="route('about')">ℹ</div>
  `;
}

/* =========================
   🌌 STARFIELD BACKGROUND
========================= */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dots = Array.from({ length: 140 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.25,
  vy: (Math.random() - 0.5) * 0.25
}));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";

  dots.forEach(d => {
    d.x += d.vx;
    d.y += d.vy;

    if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
    if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

    ctx.beginPath();
    ctx.arc(d.x, d.y, 1.3, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}
animate();

/* =========================
   🌌 WARP SYSTEM
========================= */
const warp = document.getElementById("warp");
const wctx = warp.getContext("2d");

warp.width = window.innerWidth;
warp.height = window.innerHeight;

let stars = Array.from({ length: 220 }, () => ({
  x: (Math.random() - 0.5) * warp.width,
  y: (Math.random() - 0.5) * warp.height,
  z: Math.random() * warp.width
}));

let warpOn = false;

function startWarp() {
  warpOn = true;
  warpLoop();
}

function warpLoop() {
  if (!warpOn) return;

  wctx.fillStyle = "rgba(0,0,0,0.35)";
  wctx.fillRect(0, 0, warp.width, warp.height);

  stars.forEach(s => {
    s.z -= 12;

    if (s.z <= 1) {
      s.z = warp.width;
      s.x = (Math.random() - 0.5) * warp.width;
      s.y = (Math.random() - 0.5) * warp.height;
    }

    let k = 128 / s.z;
    let x = s.x * k + warp.width / 2;
    let y = s.y * k + warp.height / 2;

    wctx.fillStyle = "white";
    wctx.fillRect(x, y, 2, 2);
  });

  requestAnimationFrame(warpLoop);
}