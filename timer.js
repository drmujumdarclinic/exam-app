// timer.js

let currentQuestionIndex = 0;
let questions = [];
let examDuration = 30 * 60; // default total exam duration in seconds (will be overridden by input)
let timer;
let timePerQuestion = 0;
let remainingTime = 0;
let extraTimes = [];
let timestamps = [];

const beep = new Audio("https://www.soundjay.com/button/beep-07.wav");

function loadExamSettings() {
  const urlParams = new URLSearchParams(window.location.search);
  const totalQuestions = parseInt(urlParams.get("questions"));
  const totalTime = parseInt(urlParams.get("time"));
  const subject = urlParams.get("subject") || "Exam";

  questions = Array.from({ length: totalQuestions }, (_, i) => `Q${i + 1}`);
  examDuration = totalTime * 60;
  timePerQuestion = examDuration / totalQuestions;

  document.getElementById("subject").textContent = subject;
  document.getElementById("total-questions").textContent = totalQuestions;
  document.getElementById("total-time").textContent = `${totalTime} mins`;

  showQuestion();
  startTimer();
}

function showQuestion() {
  const qEl = document.getElementById("question");
  if (currentQuestionIndex < questions.length) {
    qEl.textContent = questions[currentQuestionIndex];
  } else {
    endExam();
  }
}

function startTimer() {
  remainingTime = timePerQuestion;
  timer = setInterval(() => {
    if (remainingTime > 0) {
      updateTimerDisplay(remainingTime);
    } else {
      updateTimerDisplay(remainingTime); // show negative time
    }
    remainingTime--;
    if (remainingTime < -5) {
      beep.play();
      nextQuestion();
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const timerDisplay = document.getElementById("timer");
  let prefix = seconds < 0 ? "-" : "";
  const absSeconds = Math.abs(seconds);
  const mins = String(Math.floor(absSeconds / 60)).padStart(2, "0");
  const secs = String(absSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${prefix}${mins}:${secs}`;
}

function nextQuestion() {
  clearInterval(timer);
  const usedTime = timePerQuestion - remainingTime;
  extraTimes.push(usedTime);
  timestamps.push(new Date().toLocaleTimeString());
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
    startTimer();
  } else {
    endExam();
  }
}

function endExam() {
  clearInterval(timer);
  localStorage.setItem("extraTimes", JSON.stringify(extraTimes));
  localStorage.setItem("questions", JSON.stringify(questions));
  localStorage.setItem("timestamps", JSON.stringify(timestamps));
  window.location.href = "result.html";
}

document.addEventListener("DOMContentLoaded", loadExamSettings);

document.getElementById("next-btn").addEventListener("click", () => {
  nextQuestion();
});

document.getElementById("pause-btn").addEventListener("click", () => {
  clearInterval(timer);
  startTimer();
});

