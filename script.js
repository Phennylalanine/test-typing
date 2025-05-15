const jpText = document.getElementById("jpText");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

let questions = [];
let currentIndex = 0;
let score = 0;

async function loadQuestions() {
  try {
    const response = await fetch("questions.csv");
    if (!response.ok) throw new Error("CSVファイルの読み込みに失敗しました");
    const csvText = await response.text();
    questions = csvText
      .trim()
      .split("\n")
      .map(line => {
        const [jp, en] = line.split(",");
        return { jp: jp.trim(), en: en.trim() };
      });
    showQuestion();
  } catch (err) {
    jpText.textContent = "質問の読み込み中にエラーが発生しました。";
    console.error(err);
  }
}

function showQuestion() {
  feedback.textContent = "";
  answerInput.value = "";
  answerInput.disabled = false;
  nextBtn.style.display = "none";

  if (currentIndex >= questions.length) {
    jpText.textContent = "問題が終わりました！スコア: " + score;
    answerInput.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }

  jpText.textContent = questions[currentIndex].jp;
  answerInput.focus();
}

function checkAnswer() {
  const userAnswer = answerInput.value.trim();
  const correctAnswer = questions[currentIndex].en;

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    showFeedback(true);
  } else {
    showFeedback(false, correctAnswer, userAnswer);
  }

  answerInput.disabled = true;
  nextBtn.style.display = "inline-block";
  scoreDisplay.textContent = `Score: ${score}`;
}

function showFeedback(correct, expected = "", userInput = "") {
  if (correct) {
    feedback.innerHTML = "✅ 正解です！";
    score++;
  } else {
    let mismatchIndex = [...expected].findIndex((char, i) => char.toLowerCase() !== (userInput[i] || "").toLowerCase());
    if (mismatchIndex === -1 && userInput.length > expected.length) {
      mismatchIndex = expected.length;
    }
    const correctPart = expected.slice(0, mismatchIndex);
    const wrongPart = userInput[mismatchIndex] || "(入力なし)";
    const expectedChar = expected[mismatchIndex] || "(なし)";

    feedback.innerHTML =
      `❌ 間違いがあります。<br>` +
      `正しい部分: 「${correctPart}」<br>` +
      `間違った文字: 「${wrongPart}」<br>` +
      `ここは「${expectedChar}」が正しいです。`;
  }
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  showQuestion();
});

answerInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    if (!nextBtn.style.display || nextBtn.style.display === "none") {
      // Next button hidden → check answer
      checkAnswer();
    } else {
      // Next button visible → next question
      currentIndex++;
      showQuestion();
    }
  }
});

loadQuestions();
