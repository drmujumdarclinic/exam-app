const totalQuestions = parseInt(localStorage.getItem("totalQuestions"));
const timePerQuestion = parseFloat(localStorage.getItem("timePerQuestion")); // in seconds
const examName = localStorage.getItem("examName");

let currentQuestion = 1;
let actualTimes = [];
let startTime = null;
let countdown;
let paused = false;
let pauseStart = null;
let accumulatedPause = 0;

const examTitle = document.getElementById("examTitle");
const questionCount = document.getElementById("questionCount");
const totalQ = document.getElementById("totalQuestions");
const timeLeft = document.getElementById("timeLeft");
const perQuestion = document.getElementById("perQuestion");
const progressCircle = document.getElementById("progressCircle");
const centerText = document.getElementById("centerText");
// Removed beepAudio to prevent conflicts

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
  accumulatedPause = 0;
  remainingTime = timePerQuestion;
  centerText.textContent = `Q${currentQuestion}`;
  timeLeft.textContent = formatTime(timePerQuestion);
  updateProgress(timePerQuestion);
  runCountdown();
}

function runCountdown() {
  clearInterval(countdown);
  countdown = setInterval(() => {
    if (paused) return;

    let now = Date.now();
    let elapsed = (now - startTime - accumulatedPause) / 1000;
    let left = timePerQuestion - elapsed;

    timeLeft.textContent = formatTime(Math.max(0, left));
    updateProgress(Math.max(0, left));

    // No beep sound; wait for manual or voice-triggered "next"
  }, 200);
}

function moveToNext() {
  let now = Date.now();
  let elapsed = (now - startTime - accumulatedPause) / 1000;
  actualTimes.push(elapsed);

  // ✅ Vibrate for 1 second (1000 ms) on supported mobile devices
  if (navigator.vibrate) {
    navigator.vibrate(1000);
  }

  currentQuestion++;

  if (currentQuestion > totalQuestions) {
    localStorage.setItem("actualTimes", JSON.stringify(actualTimes));
    window.location.href = "result.html";
  } else {
    questionCount.textContent = currentQuestion;
    startQuestion();
  }
}

// ⏸ Pause/Resume Button
document.getElementById("pauseBtn").onclick = () => {
  paused = !paused;
  const btn = document.getElementById("pauseBtn");

  if (paused) {
    pauseStart = Date.now();
    btn.textContent = '▶️';
  } else {
    accumulatedPause += Date.now() - pauseStart;
    btn.textContent = '⏸';
  }
};

// ➡️ Manual Next Button
document.getElementById("nextBtn").onclick = () => {
  moveToNext();
};

// ▶️ Start the first question
startQuestion();

// 🧠 Voice Recognition: say "next" to move to next question
try {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log("Heard:", transcript);
    if (transcript.includes("next")) {
      moveToNext();
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    recognition.start(); // restart if ended unexpectedly
  };

  recognition.start();
} catch (err) {
  console.warn("Voice recognition not supported in this browser.");
}
