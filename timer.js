let totalQuestions = 0;
let currentQuestion = 1;
let totalTime = 0;
let perQuestionTime = 0;
let remainingTime = 0;
let interval;
let extraTimeData = [];
let isPaused = false;

const questionDisplay = document.getElementById('questionDisplay');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const pauseBtn = document.getElementById('pauseBtn');

startBtn.addEventListener('click', () => {
  totalQuestions = parseInt(document.getElementById('questions').value);
  totalTime = parseInt(document.getElementById('time').value);
  perQuestionTime = Math.floor((totalTime * 60) / totalQuestions);
  currentQuestion = 1;
  extraTimeData = [];
  isPaused = false;

  startBtn.disabled = true;
  document.getElementById('questions').disabled = true;
  document.getElementById('time').disabled = true;
  nextBtn.disabled = false;
  pauseBtn.disabled = false;

  startQuestion();
});

nextBtn.addEventListener('click', () => {
  recordExtraTime();
  if (currentQuestion < totalQuestions) {
    currentQuestion++;
    startQuestion();
  } else {
    clearInterval(interval);
    window.location.href = "result.html";
    localStorage.setItem('extraTimeData', JSON.stringify(extraTimeData));
  }
});

pauseBtn.addEventListener('click', () => {
  if (isPaused) {
    interval = setInterval(updateTimer, 1000);
    pauseBtn.textContent = "Pause";
    isPaused = false;
  } else {
    clearInterval(interval);
    pauseBtn.textContent = "Resume";
    isPaused = true;
  }
});

function startQuestion() {
  clearInterval(interval);
  remainingTime = perQuestionTime;
  updateTimerDisplay();
  questionDisplay.textContent = `Q ${currentQuestion}`;
  interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  remainingTime--;
  updateTimerDisplay();

  if (remainingTime === 0) {
    playBeep();
  }
}

function updateTimerDisplay() {
  let displayTime = remainingTime;

  if (remainingTime < 0) {
    displayTime = Math.abs(remainingTime);
    timerDisplay.textContent = `-${formatTime(Math.floor(displayTime / 60))}:${formatTime(displayTime % 60)}`;
    timerDisplay.style.color = "red"; // optional: red color for overtime
  } else {
    timerDisplay.textContent = `${formatTime(Math.floor(displayTime / 60))}:${formatTime(displayTime % 60)}`;
    timerDisplay.style.color = "#000";
  }
}

function formatTime(value) {
  return value < 10 ? `0${value}` : value;
}

function playBeep() {
  const beep = new Audio("https://www.soundjay.com/buttons/beep-07.wav");
  beep.play().catch(error => console.warn("Beep play failed:", error));
}

function recordExtraTime() {
  const extra = remainingTime < 0 ? Math.abs(remainingTime) : 0;
  extraTimeData.push({
    question: currentQuestion,
    extraTime: -extra // negative for display in chart
  });
}

////////////////////////////
// ✅ Voice Recognition
////////////////////////////

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log("Heard:", transcript);
    if (transcript === "next" || transcript === "next question") {
      nextBtn.click();
    }
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = function () {
    recognition.start(); // restart for continuous listening
  };

  recognition.start();
} else {
  console.warn("Speech recognition not supported in this browser.");
}

