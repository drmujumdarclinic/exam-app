let examName = "";
let totalQuestions = 0;
let totalTime = 0; // in minutes
let timePerQuestion = 0; // in seconds

let currentQuestion = 1;
let timeTakenPerQuestion = [];
let timer = null;
let questionStartTime = null;

const beepSound = document.getElementById("beepSound");

function startExam() {
  examName = document.getElementById("examName").value.trim();
  totalQuestions = parseInt(document.getElementById("totalQuestions").value);
  totalTime = parseFloat(document.getElementById("totalTime").value);

  if (!examName || isNaN(totalQuestions) || isNaN(totalTime) || totalQuestions <= 0 || totalTime <= 0) {
    alert("Please enter valid exam details.");
    return;
  }

  timePerQuestion = Math.round((totalTime * 60) / totalQuestions);

  document.getElementById("setupContainer").style.display = "none";
  document.getElementById("examContainer").style.display = "block";

  document.getElementById("examTitle").textContent = examName;
  document.getElementById("totalQ").textContent = totalQuestions;

  startQuestion();
}

function startQuestion() {
  document.getElementById("questionNumber").textContent = currentQuestion;
  questionStartTime = Date.now();

  let remaining = timePerQuestion;
  updateTimerDisplay(remaining);

  timer = setInterval(() => {
    remaining--;
    updateTimerDisplay(remaining);

    if (remaining <= 0) {
      clearInterval(timer);
      beepSound.play();
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById("timerDisplay").textContent =
    `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function nextQuestion() {
  if (!questionStartTime) return;

  clearInterval(timer);
  const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
  timeTakenPerQuestion.push(timeTaken);

  if (currentQuestion < totalQuestions) {
    currentQuestion++;
    startQuestion();
  } else {
    endExam();
  }
}

function endExam() {
  document.getElementById("examContainer").style.display = "none";
  document.getElementById("resultContainer").style.display = "block";
  showResultsChart();
}

function showResultsChart() {
  const labels = [];
  const targetTimes = [];
  const actualTimes = [];

  for (let i = 0; i < totalQuestions; i++) {
    labels.push(`Q${i + 1}`);
    targetTimes.push(timePerQuestion);
    actualTimes.push(timeTakenPerQuestion[i]);
  }

  new Chart(document.getElementById("resultChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Target Time (s)",
          data: targetTimes,
          backgroundColor: "rgba(54, 162, 235, 0.5)"
        },
        {
          label: "Time Taken (s)",
          data: actualTimes,
          backgroundColor: "rgba(255, 99, 132, 0.6)"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: `Result: ${examName}`
        }
      }
    }
  });
}

