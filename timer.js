// timer.js

const examData = JSON.parse(localStorage.getItem("examData"));
if (!examData) window.location.href = "index.html";

const { examName, totalQuestions, totalTime, timePerQuestion } = examData;

let currentQuestion = 1;
let perQuestionTime = timePerQuestion; // in seconds
let timeLeft = perQuestionTime;
let totalTimePassed = 0;
let totalExamSeconds = totalTime * 60;

let interval = null;
let negative = false;
let questionTimings = [];

const beep = document.getElementById("beep");
const questionTimer = document.getElementById("questionTimer");
const totalTimer = document.getElementById("totalTimer");
const questionNumber = document.getElementById("questionNumber");
const nextBtn = document.getElementById("nextBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");

const progressCircle = document.querySelector(".progress");
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `${circumference}`;

function updateProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;
}

function format(sec) {
  const m = Math.floor(Math.abs(sec) / 60).toString().padStart(2, '0');
  const s = Math.abs(sec % 60).toString().padStart(2, '0');
  return (sec < 0 ? "-" : "") + `${m}:${s}`;
}

function updateUI() {
  questionTimer.textContent = format(timeLeft);
  totalTimer.textContent = format(totalTimePassed);
  questionNumber.textContent = `${currentQuestion} / ${totalQuestions}`;
  const percent = Math.max(0, Math.min(100, ((perQuestionTime - timeLeft) / perQuestionTime) * 100));
  updateProgress(percent);
}

function startTimer() {
  interval = setInterval(() => {
    timeLeft--;
    totalTimePassed++;

    // Play beep once when time reaches 0
    if (timeLeft === 0) beep.play();

    // Don't let total exam exceed
    if (totalTimePassed >= totalExamSeconds + totalQuestions * 30) { // buffer 30s each
      stopTimer();
      goToResult();
    }

    updateUI();
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
}

function stopTimer() {
  clearInterval(interval);
}

function nextQuestion() {
  questionTimings.push({
    question: currentQuestion,
    timeTaken: perQuestionTime - timeLeft
  });

  if (currentQuestion >= totalQuestions) {
    stopTimer();
    localStorage.setItem("results", JSON.stringify(questionTimings));
    goToResult();
    return;
  }

  currentQuestion++;
  timeLeft = perQuestionTime;
  updateUI();
}

function goToResult() {
  localStorage.setItem("results", JSON.stringify(questionTimings));
  window.location.href = "result.html";
}

// Button listeners
nextBtn.addEventListener("click", nextQuestion);
pauseBtn.addEventListener("click", () => {
  if (interval) {
    pauseTimer();
    interval = null;
    pauseBtn.textContent = "▶️";
  } else {
    startTimer();
    pauseBtn.textContent = "⏸";
  }
});
stopBtn.addEventListener("click", () => {
  stopTimer();
  goToResult();
});

// Init
updateUI();
startTimer();


// At end of quiz (replace `showResult()` function in timer.js)
function showResult() {
  localStorage.setItem('timePerQuestion', JSON.stringify(timePerQuestion));
  localStorage.setItem('questionCount', totalQuestions);
  localStorage.setItem('targetTime', perQuestionTime);
  localStorage.setItem('examName', examName);
  window.location.href = "result.html";
}
