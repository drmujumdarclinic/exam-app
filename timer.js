let currentQuestion = 0;
let totalQuestions = 0;
let totalExamTime = 0; // in minutes
let timePerQuestion = 0; // in seconds
let timer;
let timeLeft;
let isNegative = false;
let negativeTime = 0;
let responses = [];
let isStarted = false;

// Beep sound
const beep = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");

function formatTime(seconds) {
  const absSec = Math.abs(seconds);
  const mins = String(Math.floor(absSec / 60)).padStart(2, "0");
  const secs = String(absSec % 60).padStart(2, "0");
  return (seconds < 0 ? "-" : "") + `${mins}:${secs}`;
}

function startTimer() {
  if (!isStarted) {
    const totalTimeInput = document.getElementById("totalTime").value;
    const totalQuestionsInput = document.getElementById("totalQuestions").value;

    if (!totalTimeInput || !totalQuestionsInput) {
      alert("Please enter total time and total questions.");
      return;
    }

    totalExamTime = parseInt(totalTimeInput);
    totalQuestions = parseInt(totalQuestionsInput);
    timePerQuestion = Math.floor((totalExamTime * 60) / totalQuestions); // in seconds
    isStarted = true;
  }

  if (currentQuestion >= totalQuestions) {
    alert("All questions completed!");
    return;
  }

  timeLeft = timePerQuestion;
  isNegative = false;
  negativeTime = 0;
  document.getElementById("questionCounter").innerText = `Question ${currentQuestion + 1}/${totalQuestions}`;

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    const timerDisplay = document.getElementById("timerDisplay");

    if (timeLeft > 0) {
      timerDisplay.innerText = formatTime(timeLeft);
      timeLeft--;
    } else {
      // Time is over, count in negative
      isNegative = true;
      negativeTime++;
      timerDisplay.innerText = formatTime(-negativeTime);
    }
  }, 1000);
}

function nextQuestion() {
  if (!isStarted) {
    alert("Please start the test first.");
    return;
  }

  clearInterval(timer);

  responses.push({
    question: currentQuestion + 1,
    extraTime: isNegative ? negativeTime : 0,
  });

  currentQuestion++;
  beep.play();
  if (currentQuestion < totalQuestions) {
    startTimer();
  } else {
    alert("Test completed!");
    showResults();
  }
}

function showResults() {
  let container = document.getElementById("resultContainer");
  container.innerHTML = "<h3>Time Summary</h3>";

  let totalExtra = 0;
  let resultList = document.createElement("ul");
  responses.forEach((res) => {
    const li = document.createElement("li");
    li.innerText = `Question ${res.question}: Extra Time = ${res.extraTime} sec`;
    totalExtra += res.extraTime;
    resultList.appendChild(li);
  });

  container.appendChild(resultList);
  container.innerHTML += `<p><strong>Total Extra Time:</strong> ${totalExtra} seconds</p>`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startButton")?.addEventListener("click", startTimer);
  document.getElementById("nextButton")?.addEventListener("click", nextQuestion);
});

