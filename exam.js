let questionNumber = 1;
let questionStartTime;
let timerInterval;

// Format seconds to MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update timer every second
function updateTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - questionStartTime) / 1000);
  document.getElementById("questionTimer").textContent = formatTime(elapsed);
}

// Start the exam
function startExam() {
  const examName = document.getElementById("examName").value.trim();
  if (!examName) {
    alert("Please enter exam name!");
    return;
  }

  document.getElementById("examTitle").textContent = `Exam: ${examName}`;
  document.getElementById("setupContainer").style.display = "none";
  document.getElementById("examContainer").style.display = "block";

  questionNumber = 1;
  document.getElementById("questionNumber").textContent = questionNumber;

  questionStartTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

// Go to next question
function nextQuestion() {
  clearInterval(timerInterval);

  const now = Date.now();
  const timeSpent = Math.floor((now - questionStartTime) / 1000);
  console.log(`Question ${questionNumber} time: ${formatTime(timeSpent)}`);

  // TODO: Save data somewhere (Google Sheets, localStorage, etc.)

  // Start next question
  questionNumber++;
  document.getElementById("questionNumber").textContent = questionNumber;

  // Reset and start timer again
  document.getElementById("questionTimer").textContent = "00:00";
  questionStartTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}
