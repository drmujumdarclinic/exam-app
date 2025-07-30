// exam.js

let examName = "";
let totalQuestions = 0;
let totalTimeInMinutes = 0;
let perQuestionTimeInSeconds = 0;
let currentQuestion = 1;
let timer;
let timeLeft;
let startTime;
let extraTime = [];

const configSection = document.getElementById("config-section");
const timerSection = document.getElementById("timer-section");
const chartSection = document.getElementById("chart-section");
const questionLabel = document.getElementById("question-label");
const timerDisplay = document.getElementById("timer-display");
const nextButton = document.getElementById("next-button");
const examTitle = document.getElementById("exam-title");
const chartCanvas = document.getElementById("result-chart");

function startExam() {
  examName = document.getElementById("exam-name").value;
  totalQuestions = parseInt(document.getElementById("total-questions").value);
  totalTimeInMinutes = parseInt(document.getElementById("total-time").value);

  if (!examName || !totalQuestions || !totalTimeInMinutes) {
    alert("Please fill all fields correctly.");
    return;
  }

  perQuestionTimeInSeconds = Math.floor((totalTimeInMinutes * 60) / totalQuestions);
  examTitle.innerText = examName;
  configSection.style.display = "none";
  timerSection.style.display = "block";
  startQuestion();
}

function startQuestion() {
  if (currentQuestion > totalQuestions) {
    endExam();
    return;
  }

  questionLabel.innerText = `Question ${currentQuestion} of ${totalQuestions}`;
  timeLeft = perQuestionTimeInSeconds;
  startTime = Date.now();
  updateTimerDisplay();

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    let now = Date.now();
    let elapsed = Math.floor((now - startTime) / 1000);
    let displayTime = perQuestionTimeInSeconds - elapsed;

    if (displayTime >= 0) {
      timerDisplay.innerText = formatTime(displayTime);
    } else {
      timerDisplay.innerText = `-${formatTime(-displayTime)}`;
      timerDisplay.classList.add("over-time");
    }
  }, 1000);
}

function nextQuestion() {
  let now = Date.now();
  let timeTaken = Math.floor((now - startTime) / 1000);
  let overTime = timeTaken - perQuestionTimeInSeconds;
  extraTime.push(overTime);
  currentQuestion++;
  timerDisplay.classList.remove("over-time");
  startQuestion();
}

function endExam() {
  clearInterval(timer);
  timerSection.style.display = "none";
  chartSection.style.display = "block";
  showChart();
}

function showChart() {
  const ctx = chartCanvas.getContext("2d");
  const data = {
    labels: Array.from({ length: totalQuestions }, (_, i) => `Q${i + 1}`),
    datasets: [
      {
        label: "Target Time (sec)",
        data: Array(totalQuestions).fill(perQuestionTimeInSeconds),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Time Taken (sec)",
        data: extraTime.map(x => x + perQuestionTimeInSeconds),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function formatTime(sec) {
  const minutes = Math.floor(sec / 60).toString().padStart(2, "0");
  const seconds = (sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

nextButton.addEventListener("click", nextQuestion);
document.getElementById("start-button").addEventListener("click", startExam);
