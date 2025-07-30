// timer.js
const examName = localStorage.getItem("examName") || "Exam";
const totalQuestions = parseInt(localStorage.getItem("totalQuestions")) || 1;
const timePerQuestion = parseInt(localStorage.getItem("timePerQuestion")) || 60;

let currentQuestion = 1;
let remainingTime = timePerQuestion;
let totalTimeSpent = 0;

const questionDisplay = document.getElementById("questionNumber");
const timerDisplay = document.getElementById("timer");
const examNameDisplay = document.getElementById("examName");

examNameDisplay.textContent = examName;

function updateDisplay() {
  timerDisplay.textContent = `${Math.floor(remainingTime / 60).toString().padStart(2, '0')}:${(remainingTime % 60).toString().padStart(2, '0')}`;
  questionDisplay.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
}

function nextQuestion() {
  if (currentQuestion < totalQuestions) {
    currentQuestion++;
    remainingTime = timePerQuestion;
    updateDisplay();
    playBeep();
  } else {
    finishExam();
  }
}

function finishExam() {
  localStorage.setItem("totalTimeSpent", totalTimeSpent);
  window.location.href = "result.html";
}

function playBeep() {
  const beep = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.wav");
  beep.play();
}

updateDisplay();

const interval = setInterval(() => {
  remainingTime--;
  totalTimeSpent++;
  updateDisplay();
  if (remainingTime <= 0) {
    nextQuestion();
  }
}, 1000);
