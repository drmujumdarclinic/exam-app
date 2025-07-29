// script.js

let examData = JSON.parse(localStorage.getItem('examData'));
let currentQuestion = 1;
let timeLeft = examData.totalTime;
let timeTaken = [];
let questionStartTime = Date.now();

document.getElementById('examTitle').innerText = examData.examName;
document.getElementById('totalQ').innerText = examData.totalQuestions;

function updateTimer() {
  let mins = Math.floor(timeLeft / 60);
  let secs = timeLeft % 60;
  document.getElementById('timeLeft').innerText = `${mins}m ${secs}s`;
  timeLeft--;
  if (timeLeft < 0) {
    finishExam();
  }
}
let countdown = setInterval(updateTimer, 1000);

document.getElementById('nextQ').addEventListener('click', () => {
  let now = Date.now();
  let timeSpent = Math.floor((now - questionStartTime) / 1000);
  timeTaken.push(timeSpent);
  questionStartTime = now;

  currentQuestion++;
  if (currentQuestion > examData.totalQuestions) {
    finishExam();
  } else {
    document.getElementById('currentQ').innerText = currentQuestion;
  }
});

function finishExam() {
  clearInterval(countdown);
  localStorage.setItem('timeTaken', JSON.stringify(timeTaken));
  window.location.href = 'result.html';
}
