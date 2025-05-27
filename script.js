let questions = [];
let currentQuestion = null;
let score = 0;
let streak = 0;
let streakUpgrades = 0;

const questionDisplay = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const streakDisplay = document.getElementById("streak");
const minigameScreen = document.getElementById("minigameScreen");
const minigameCanvas = document.getElementById("minigameCanvas");
const ctx = minigameCanvas.getContext("2d");

function loadCSVAndStart() {
  Papa.parse("questions.csv", {
    download: true,
    header: true,
    complete: function(results) {
      questions = results.data.filter(q => q.jp && q.en);
      startGame();
    }
  });
}

function startGame() {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  showQuestion();
}

function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function showQuestion() {
  currentQuestion = getRandomQuestion();
  questionDisplay.textContent = currentQuestion.jp;
  answerInput.value = "";
  answerInput.disabled = false;
  feedback.innerHTML = "";
  nextBtn.style.display = "none";
  answerInput.focus();
  if (currentQuestion.en) speak(currentQuestion.en);
}

function showFeedback(correct, expected, userInput) {
  if (correct) {
    feedback.innerHTML = "✅ 正解！Good job!";
    score++;
    streak++;
    scoreDisplay.textContent = "Score: " + score;
    streakDisplay.textContent = "連続正解: " + streak;
    document.getElementById("correctSound").play();

    if (streak % 5 === 0) {
      streakUpgrades++;
      setTimeout(startMinigame, 500);
      return;
    }
  } else {
    streak = 0;
    streakDisplay.textContent = "連続正解: 0";
    const minLength = Math.min(expected.length, userInput.length);
    let mismatchIndex = -1;
    for (let i = 0; i < minLength; i++) {
      if (expected[i] !== userInput[i]) {
        mismatchIndex = i;
        break;
      }
    }
    if (mismatchIndex === -1) mismatchIndex = minLength;
    const correctPart = expected.slice(0, mismatchIndex);
    const wrongPart = expected.slice(mismatchIndex) || "<span style='color:green'>(missing)</span>";
    const userWrong = userInput.slice(mismatchIndex) || "<span style='color:red'>(missing)</span>";
    feedback.innerHTML = `
      ❌ 間違いがあります<br/>
      <strong>正解:</strong> ${correctPart}<span style="color:green">${wrongPart}</span><br/>
      <strong>あなたの答え:</strong> ${correctPart}<span style="color:red">${userWrong}</span>
    `;
    document.getElementById("wrongSound").play();
  }

  answerInput.disabled = true;
  nextBtn.style.display = "inline-block";
}

answerInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    if (answerInput.disabled) {
      showQuestion();
    } else {
      const userAnswer = answerInput.value.trim();
      const expected = currentQuestion.en.trim();
      const isCorrect = userAnswer === expected;
      showFeedback(isCorrect, expected, userAnswer);
    }
  }
});

nextBtn.addEventListener("click", showQuestion);
document.getElementById("speakBtn").addEventListener("click", () => speak(currentQuestion.en));
document.getElementById("startBtn").addEventListener("click", loadCSVAndStart);
startScreen.style.display = "block";

// --- BONUS GAME VARIABLES ---
let player = { x: 200, y: 200 };
let bullets = [];
let enemies = [];
let keys = {};

function startMinigame() {
  gameScreen.style.display = "none";
  minigameScreen.style.display = "block";
  bullets = [];
  enemies = Array.from({ length: 5 }, () => ({
    x: Math.random() * 400,
    y: Math.random() * 400,
    hp: 2 + streakUpgrades,
  }));

  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);

  setInterval(() => {
    bullets.push({
      x: player.x,
      y: player.y,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 2 - 1,
      speed: 2 + streakUpgrades,
      damage: 1 + streakUpgrades,
    });
  }, 300);

  requestAnimationFrame(updateMinigame);
}

function updateMinigame() {
  ctx.clearRect(0, 0, 400, 400);

  // Move player
  if (keys["ArrowUp"] || keys["w"]) player.y -= 2;
  if (keys["ArrowDown"] || keys["s"]) player.y += 2;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= 2;
  if (keys["ArrowRight"] || keys["d"]) player.x += 2;

  // Draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x - 5, player.y - 5, 10, 10);

  // Update and draw bullets
  ctx.fillStyle = "black";
  bullets.forEach((b, i) => {
    b.x += b.dx * b.speed;
    b.y += b.dy * b.speed;
    ctx.fillRect(b.x, b.y, 4, 4);

    // Check collisions
    enemies.forEach(e => {
      const dist = Math.hypot(b.x - e.x, b.y - e.y);
      if (dist < 10) {
        e.hp -= b.damage;
        bullets.splice(i, 1);
      }
    });
  });

  // Remove dead enemies
  enemies = enemies.filter(e => e.hp > 0);

  // Draw enemies
  ctx.fillStyle = "red";
  enemies.forEach(e => ctx.beginPath() || ctx.arc(e.x, e.y, 8, 0, Math.PI * 2) || ctx.fill());

  // End condition
  if (enemies.length > 0) {
    requestAnimationFrame(updateMinigame);
  }
}

function endMinigame() {
  minigameScreen.style.display = "none";
  gameScreen.style.display = "block";
  showQuestion();
}
