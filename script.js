let questions = [];
let currentQuestion = null;
let score = 0;

const questionDisplay = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

// Load CSV on start
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

  if (currentQuestion.en) {
    speak(currentQuestion.en);
  }
}

function showFeedback(correct, expected, userInput) {
  if (correct) {
    feedback.innerHTML = "✅ 正解！Good job!";
    score++;
    scoreDisplay.textContent = "Score: " + score;

    const correctSound = document.getElementById("correctSound");
    if (correctSound) correctSound.play();
  } else {
    let mismatchIndex = -1;
    const minLength = Math.min(expected.length, userInput.length);
    for (let i = 0; i < minLength; i++) {
      if (expected[i] !== userInput[i]) {
        mismatchIndex = i;
        break;
      }
    }
    if (mismatchIndex === -1) {
      mismatchIndex = minLength;
    }

    const correctPart = expected.slice(0, mismatchIndex);
    const wrongPart = expected.slice(mismatchIndex) || "<span style='color:green'>(missing)</span>";
    const userWrong = userInput.slice(mismatchIndex) || "<span style='color:red'>(missing)</span>";

    feedback.innerHTML = `
      ❌ 間違いがあります<br/>
      <strong>正解:</strong> ${correctPart}<span style="color:green">${wrongPart}</span><br/>
      <strong>あなたの答え:</strong> ${correctPart}<span style="color:red">${userWrong}</span>
    `;

    const wrongSound = document.getElementById("wrongSound");
    if (wrongSound) wrongSound.play();
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

const speakBtn = document.getElementById("speakBtn");
if (speakBtn) {
  speakBtn.addEventListener("click", function() {
    if (currentQuestion && currentQuestion.en) {
      speak(currentQuestion.en);
    }
  });
}

// Start button listener
document.getElementById("startBtn").addEventListener("click", loadCSVAndStart);

// Show the start screen initially
startScreen.style.display = "block";
