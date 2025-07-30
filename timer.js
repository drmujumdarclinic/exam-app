const totalQuestions = parseInt(localStorage.getItem("totalQuestions"));
const timePerQuestion = parseFloat(localStorage.getItem("timePerQuestion")); // in seconds
const examName = localStorage.getItem("examName");

let currentQuestion = 1;
let actualTimes = [];
let startTime = null;
let countdown;
let paused = false;
let remainingTime = timePerQuestion;

const examTitle = document.getElementById("examTitle");
const questionCount = document.getElementById("questionCount");
const totalQ = document.getElementById("totalQuestions");
const timeLeft = document.getElementById("timeLeft");
const perQuestion = document.getElementById("perQuestion");
const progressCircle = document.getElementById("progressCircle");
const centerText = document.getElementById("centerText");
const beepAudio = document.getElementById("beepAudio");

examTitle.innerText = examName;
totalQ.innerText = totalQuestions;
perQuestion.innerText = formatTime(timePerQuestion);

function formatTime(seconds) {
  let m = Math.floor(seconds / 60);
  let s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateProgress(timeLeftSec) {
  const percent = timeLeftSec / timePerQuestion;
  const offset = 282.6 * (1 - percent);
  progressCircle.style.strokeDashoffset = offset;
}

function startQuestion() {
  startTime = Date.now();
  remainingTime = timePerQuestion;
  centerText.textContent = `Q${currentQuestion}`;
  updateCountdown();
}

function updateCountdown() {
  clearInterval(countdown);
  countdown = setInterval(() => {
    if (!paused) {
      const elapsed = (Date.now() - startTime) / 1000;
      let left = timePerQuestion - elapsed;

      if (left <= 0) {
        beepAudio.play();
        clearInterval(countdown);
        actualTimes.push(timePerQuestion); // exactly on time
        moveToNext();
      } else {
        timeLeft.textContent = formatTime(left);
        updateProgress(left);
      }
    }
  }, 1000);
}

function moveToNext() {
  const elapsed = (Date.now() - startTime) / 1000;
  actualTimes.push(elapsed);
  currentQuestion++;

  if (currentQuestion > totalQuestions) {
    localStorage.setItem("actualTimes", JSON.stringify(actualTimes));
    window.location.href = "result.html";
  } else {
    questionCount.textContent = currentQuestion;
    startQuestion();
  }
}

// Control Buttons
document.getElementById("pauseBtn").onclick = () => {
  paused = !paused;
  if (!paused) {
    startTime = Date.now() - (timePerQuestion - remainingTime) * 1000;
  }
};

document.getElementById("nextBtn").onclick = () => {
  moveToNext();
};

startQuestion();
