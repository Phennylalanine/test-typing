// game.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  color: "blue",
  speed: 3,
  dir: { x: 0, y: -1 },
  hp: 20,
  xp: 0,
  level: 1,
  nextLevelXP: 5,
};

let keys = {};
let projectiles = [];
let enemies = [];
let lastShotTime = 0;
const shootInterval = 3000; // 1 shot every 3 seconds

function updateXP(amount) {
  player.xp += amount;
  if (player.xp >= player.nextLevelXP) {
    player.level++;
    player.xp = 0;
    player.nextLevelXP = player.level < 20 ? player.nextLevelXP + 10 : player.nextLevelXP + 20;
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawProjectiles() {
  ctx.fillStyle = "black";
  projectiles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function movePlayer() {
  if (keys["ArrowUp"]) { player.y -= player.speed; player.dir = { x: 0, y: -1 }; }
  if (keys["ArrowDown"]) { player.y += player.speed; player.dir = { x: 0, y: 1 }; }
  if (keys["ArrowLeft"]) { player.x -= player.speed; player.dir = { x: -1, y: 0 }; }
  if (keys["ArrowRight"]) { player.x += player.speed; player.dir = { x: 1, y: 0 }; }
}

function shootProjectile() {
  const now = Date.now();
  if (now - lastShotTime >= shootInterval) {
    projectiles.push({
      x: player.x,
      y: player.y,
      dx: player.dir.x * 5,
      dy: player.dir.y * 5,
    });
    lastShotTime = now;
  }
}

function spawnEnemy() {
  const size = 15;
  let x, y;
  if (Math.random() < 0.5) {
    x = Math.random() * canvas.width;
    y = Math.random() < 0.5 ? -size : canvas.height + size;
  } else {
    x = Math.random() < 0.5 ? -size : canvas.width + size;
    y = Math.random() * canvas.height;
  }
  enemies.push({ x, y, size });
}

function moveEnemies() {
  enemies.forEach(e => {
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const dist = Math.hypot(dx, dy);
    e.x += (dx / dist) * 1.5;
    e.y += (dy / dist) * 1.5;
  });
}

function updateProjectiles() {
  projectiles.forEach((p, index) => {
    p.x += p.dx;
    p.y += p.dy;
    // Remove if off-screen
    if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
      projectiles.splice(index, 1);
    }
  });
}

function detectCollisions() {
  enemies.forEach((enemy, eIdx) => {
    // Player collision
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    if (Math.hypot(dx, dy) < player.size + enemy.size) {
      player.hp--;
      enemies.splice(eIdx, 1);
      if (player.hp <= 0) {
        alert("ゲームオーバー！Game Over!");
        showStartScreen();
      }
    }

    // Projectile collisions
    projectiles.forEach((proj, pIdx) => {
      const dpx = proj.x - enemy.x;
      const dpy = proj.y - enemy.y;
      if (Math.hypot(dpx, dpy) < enemy.size + 5) {
        enemies.splice(eIdx, 1);
        projectiles.splice(pIdx, 1);
        updateXP(1);
      }
    });
  });
}

function drawHUD() {
  ctx.fillStyle = "black";
  ctx.fillText(`HP: ${player.hp}`, 10, 20);
  ctx.fillText(`LV: ${player.level}`, 10, 40);
  ctx.fillText(`XP: ${player.xp}/${player.nextLevelXP}`, 10, 60);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  shootProjectile();
  moveEnemies();
  updateProjectiles();
  detectCollisions();

  drawPlayer();
  drawEnemies();
  drawProjectiles();
  drawHUD();

  requestAnimationFrame(gameLoop);
}

function initGame() {
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  player.hp = 20;
  player.xp = 0;
  player.level = 1;
  player.nextLevelXP = 5;
  projectiles = [];
  enemies = [];
  lastShotTime = 0;
  setInterval(spawnEnemy, 2000);
  gameLoop();
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
