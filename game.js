// game.js

let currentLevel = 1;
let onGameEndCallback = null;

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

// Example player and enemy objects
let player = {
  x: 50,
  y: 50,
  health: 100,
  speed: 5,
};

let enemy = {
  x: 300,
  y: 50,
  health: 50,
  baseSpeed: 2,
  speed: 2,
};

let gameRunning = false;

function initGame(level = 1, returnToQuizCallback = null) {
  currentLevel = level;
  onGameEndCallback = returnToQuizCallback;

  // Reset player and enemy states
  player.x = 50;
  player.y = 50;
  player.health = 100;

  enemy.x = 300;
  enemy.y = 50;
  enemy.health = 50 + currentLevel * 10;  // Scale enemy health by level
  enemy.speed = enemy.baseSpeed + currentLevel * 0.5; // Scale speed

  gameRunning = true;

  gameCanvas.style.display = "block";

  console.log(`Game started at Level ${currentLevel}`);

  startGameLoop();
}

function startGameLoop() {
  if (!gameRunning) return;

  update();
  draw();

  // Continue loop
  requestAnimationFrame(startGameLoop);
}

function update() {
  // Simple enemy AI: move left toward player
  if (enemy.x > player.x) {
    enemy.x -= enemy.speed;
  }

  // Check collision (simple)
  if (
    Math.abs(enemy.x - player.x) < 10 &&
    Math.abs(enemy.y - player.y) < 10
  ) {
    player.health -= 1;  // Player takes damage
  }

  // Check if game over conditions met
  checkGameStatus();
}

function draw() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, 20, 20);

  // Draw enemy
  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, 20, 20);

  // Draw health bars
  ctx.fillStyle = "green";
  ctx.fillRect(10, 10, player.health, 10);

  ctx.fillStyle = "green";
  ctx.fillRect(10, 30, enemy.health, 10);

  // Draw level text
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`Level: ${currentLevel}`, 10, 60);
}

function checkGameStatus() {
  if (enemy.health <= 0) {
    endGame(true);  // player won
  } else if (player.health <= 0) {
    endGame(false); // player lost
  }
}

function endGame(didWin) {
  gameRunning = false;
  gameCanvas.style.display = "none";

  if (didWin) {
    currentLevel++;
    alert(`You won! Proceeding to level ${currentLevel}`);
  } else {
    alert("You lost! Try again from the same level.");
  }

  if (typeof onGameEndCallback === "function") {
    onGameEndCallback(currentLevel);
  }
}

// Example function to damage enemy (e.g., from projectile)
function damageEnemy(amount) {
  enemy.health -= amount;
  if (enemy.health < 0) enemy.health = 0;
}

// Export functions if using modules or just keep global
window.initGame = initGame;
window.damageEnemy = damageEnemy;
