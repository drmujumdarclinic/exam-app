let examName, duration, totalQuestions;
let questionIndex = 0;
let questionTimes = [];
let examStartTime, questionStartTime;
let timerInterval;

function startExam() {
  examName = document.getElementById("examName").value;
  duration = parseInt(document.getElementById("duration").value) * 60; // in seconds
  totalQuestions = parseInt(document.getElementById("totalQuestions").value);

  if (!examName || !duration || !totalQuestions) {
    alert("Please fill all fields");
    return;
  }

  document.getElementById("setup").style.display = "none";
  document.getElementById("examArea").style.display = "block";

  examStartTime = Date.now();
  questionStartTime = Date.now();
  questionIndex = 1;

  updateQuestionUI();
  startTimer();
}

function updateQuestionUI() {
  document.getElementById("questionHeading").textContent = `Question ${questionIndex}`;
}

function nextQuestion() {
  const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
  questionTimes.push(timeSpent);
  questionStartTime = Date.now();
  questionIndex++;

  if (questionIndex > totalQuestions) {
    endExam();
  } else {
    updateQuestionUI();
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

function endExam() {
  clearInterval(timerInterval);
  document.getElementById("examArea").style.display = "none";
  document.getElementById("resultArea").style.display = "block";

  let reportHTML = `<h3>${examName} - Time Analysis</h3><ul>`;
  let totalTime = 0;
  questionTimes.forEach((sec, idx) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    reportHTML += `<li>Q${idx + 1}: ${min}m ${s}s</li>`;
    totalTime += sec;
  });

  const totalMin = Math.floor(totalTime / 60);
  const totalSec = totalTime % 60;
  reportHTML += `</ul><strong>Total Time Used:</strong> ${totalMin}m ${totalSec}s`;

  // Optional: show extra time
  const allowed = duration;
  if (totalTime > allowed) {
    const extra = totalTime - allowed;
    const extraMin = Math.floor(extra / 60);
    const extraSec = extra % 60;
    reportHTML += `<p style="color:red;"><strong>Extra Time Used:</strong> ${extraMin}m ${extraSec}s</p>`;
  }

  document.getElementById("timeReport").innerHTML = reportHTML;
}
