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
let recognition; // voice recognition instance

const examTitle = document.getElementById("examTitle");
const questionCount = document.getElementById("questionCount");
const totalQ = document.getElementById("totalQuestions");
const timeLeft = document.getElementById("timeLeft");
const perQuestion = document.getElementById("perQuestion");
const progressCircle = document.getElementById("progressCircle");
const centerText = document.getElementById("centerText");

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
  }, 200);
}

function moveToNext() {
  let now = Date.now();
  let elapsed = (now - startTime - accumulatedPause) / 1000;
  actualTimes.push(elapsed);

  if (navigator.vibrate) navigator.vibrate(1000); // vibrate on mobile

  currentQuestion++;
  if (currentQuestion > totalQuestions) {
    localStorage.setItem("actualTimes", JSON.stringify(actualTimes));
    stopVoiceRecognition();
    window.location.href = "result.html";
  } else {
    questionCount.textContent = currentQuestion;
    startQuestion();
  }
}

// Pause/Resume Button
document.getElementById("pauseBtn").onclick = () => {
  paused = !paused;
  const btn = document.getElementById("pauseBtn");
  if (paused) {
    pauseStart = Date.now();
    btn.textContent = '▶️';
    stopVoiceRecognition();
  } else {
    accumulatedPause += Date.now() - pauseStart;
    btn.textContent = '⏸';
    startVoiceRecognition();
  }
};

// Manual Next Button
document.getElementById("nextBtn").onclick = () => {
  moveToNext();
};

// Start
startQuestion();
startVoiceRecognition();

// Voice recognition setup
function startVoiceRecognition() {
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("Heard:", transcript);
      if (transcript.includes("next")) {
        moveToNext();
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        alert("Microphone access is denied. Please allow mic access in browser settings.");
        stopVoiceRecognition();
      }
    };

    recognition.onend = () => {
      // Only restart if not paused
      if (!paused && currentQuestion <= totalQuestions) {
        setTimeout(() => {
          startVoiceRecognition();
        }, 500); // slight delay to avoid loop errors
      }
    };

    recognition.start();
  } catch (err) {
    console.warn("Voice recognition not supported or blocked:", err.message);
  }
}

function stopVoiceRecognition() {
  try {
    if (recognition) {
      recognition.onend = null; // prevent auto-restart
      recognition.stop();
    }
  } catch (err) {
    console.warn("Error stopping recognition:", err.message);
  }
}

