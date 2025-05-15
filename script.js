let questions = [];
let currentQuestion = null;
let score = 0;

const questionDisplay = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const scoreDisplay = document.getElementById("score");

// Load CSV with PapaParse
Papa.parse("questions.csv", {
  download: true,
  header: true,
  complete: function(results) {
    questions = results.data.filter(q => q.jp && q.en); // remove empty rows
    showQuestion();
  }
});

function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

function showQuestion() {
  currentQuestion = getRandomQuestion();
  questionDisplay.textContent = currentQuestion.jp;
  answerInput.value = "";
  answerInput.disabled = false;
  feedback.innerHTML = "";
  nextBtn.style.display = "none"; // Always hide the button (optional)
  answerInput.focus();
}

function showFeedback(correct, expected, userInput) {
  if (correct) {
    feedback.innerHTML = "✅ 正解！Good job!";
    score++;
    scoreDisplay.textContent = "Score: " + score;
  } else {
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
  nextBtn.style.display = "none"; // Always hide the button (optional)
}

answerInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    const userAnswer = answerInput.value.trim();

    if (answerInput.disabled) {
      // If answer already submitted, move to next question
      showQuestion();
    } else if (userAnswer !== "") {
      // Only process if input is not blank
      const expected = currentQuestion.en.trim();
      const isCorrect = userAnswer === expected;
      showFeedback(isCorrect, expected, userAnswer);
    }
  }
});

// You can keep this if you want button support too:
nextBtn.addEventListener("click", showQuestion);
