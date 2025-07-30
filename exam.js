let totalQuestions = 10;
let currentQuestion = 1;
let timePerQuestion = 60; // seconds
let timeRemaining = timePerQuestion;
let interval;
let isPaused = false;
let extraTime = 0;

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;

function setProgress(percent) {
  const offset = circumference - (percent * circumference);
  circle.style.strokeDashoffset = offset;
}

function updateDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.abs(timeRemaining % 60);
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const timeDisplay = document.getElementById("timeDisplay");
  timeDisplay.textContent = timeRemaining < 0 ? `-${formatted}` : formatted;
  timeDisplay.classList.toggle("negative", timeRemaining < 0);
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    if (!isPaused) {
      timeRemaining--;
      const percent = Math.max(0, timeRemaining) / timePerQuestion;
      setProgress(percent);
      updateDisplay();
    }
  }, 1000);
}

document.getElementById("nextBtn").addEventListener("click", () => {
  clearInterval(interval);
  // Log current time (can later store it)
  console.log(`Q${currentQuestion}: Time taken = ${timePerQuestion - timeRemaining}s`);
  currentQuestion++;
  if (currentQuestion > totalQuestions) {
    alert("Exam Finished!");
    return;
  }
  document.getElementById("questionCounter").textContent = `${currentQuestion} / ${totalQuestions}`;
  timeRemaining = timePerQuestion;
  setProgress(1);
  updateDisplay();
  startTimer();
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  isPaused = !isPaused;
});

document.getElementById("stopBtn").addEventListener("click", () => {
  clearInterval(interval);
});

// Start first question
setProgress(1);
updateDisplay();
startTimer();
