let questions = [];
let currentQuestion = null;
let score = 0;
let streak = 0;
let playerLevel = 1; // Store player level here

const questionDisplay = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const gameCanvas = document.getElementById("gameCanvas");
const streakDisplay = document.getElementById("streakDisplay");

Papa.parse("questions.csv", {
  download: true,
  header: true,
  complete: function(results) {
    questions = results.data.filter(q => q.jp && q.en);
    showStartScreen();
  }
});

function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function showStartScreen() {
  startScreen.style.display = "block";
  quizScreen.style.display = "none";
  gameCanvas.style.display = "none";
}

function showQuizScreen() {
  startScreen.style.display = "none";
  quizScreen.style.display = "block";
  gameCanvas.style.display = "none";
}

// Modified startQuiz to NOT reset score and streak every time 
// so progress persists when returning from the game
function startQuiz() {
  showQuizScreen();
  // Only reset score and streak if you want to restart fresh:
  if (score === 0 && streak === 0) {
    // Or add a separate flag to detect a fresh start if needed
  }
  scoreDisplay.textContent = `Score: ${score} (LV ${playerLevel})`;
  streakDisplay.textContent = `連続正解: ${streak}`;
  showQuestion();
}

function showQuestion() {
  currentQuestion = getRandomQuestion();
  questionDisplay.textContent = `${currentQuestion.en} - ${currentQuestion.jp}`;
  answerInput.value = "";
  answerInput.disabled = false;
  feedback.innerHTML = "";
  nextBtn.style.display = "none";
  answerInput.focus();
  speak(currentQuestion.en);
}

function showFeedback(correct, expected, userInput) {
  if (correct) {
    feedback.innerHTML = "✅ 正解！Good job!";
    score++;
    streak++;
    scoreDisplay.textContent = `Score: ${score} (LV ${playerLevel})`;
    streakDisplay.textContent = `連続正解: ${streak}`;

    if (streak % 5 === 0) {
      launchGame();
      return;
    }
  } else {
    streak = 0;
    let mismatchIndex = [...expected].findIndex((char, i) => char !== userInput[i]);
    if (mismatchIndex === -1 && userInput.length > expected.length) {
      mismatchIndex = expected.length;
    }
    const correctPart = expected.slice(0, mismatchIndex);
    const wrongPart = expected.slice(mismatchIndex);
    feedback.innerHTML = `
      ❌ 間違いがあります<br/>
      <strong>正解:</strong> ${expected}<br/>
      <strong>あなたの答え:</strong> ${userInput}<br/>
      <strong>ここが間違い:</strong> ${correctPart}<span style="color:red">${wrongPart}</span>
    `;
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
      const isCorrect = userAnswer.toLowerCase() === expected.toLowerCase();
      showFeedback(isCorrect, expected, userAnswer);
    }
  }
});

nextBtn.addEventListener("click", showQuestion);
document.getElementById("startBtn").addEventListener("click", () => {
  score = 0;
  streak = 0;
  playerLevel = 1;
  startQuiz();
});

function launchGame() {
  quizScreen.style.display = "none";
  gameCanvas.style.display = "block";
  if (typeof initGame === "function") {
    // Pass current playerLevel and returnToQuiz callback to game
    initGame(playerLevel, returnToQuiz);
  } else {
    console.error("initGame is not defined.");
    alert("Game failed to launch. Check game.js.");
  }
}

// Callback called by game when player finishes and returns
function returnToQuiz(newLevel) {
  playerLevel = newLevel;
  startQuiz();
}
