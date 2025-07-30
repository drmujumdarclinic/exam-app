window.onload = function () {
  const startButton = document.getElementById("startBtn");
  const examContainer = document.getElementById("examContainer");
  const resultDiv = document.getElementById("result");
  const timerCircle = document.querySelector(".timer-circle");
  const timerText = document.getElementById("timer");
  const questionText = document.getElementById("questionText");
  const questionInput = document.getElementById("questionInput");
  const nextButton = document.getElementById("nextBtn");
  const examNameInput = document.getElementById("examName");
  const numQuestionsInput = document.getElementById("numQuestions");

  // Working beep audio
  const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

  let currentQuestion = 0;
  let totalQuestions = 0;
  let examName = "";
  let timer = null;
  let timeLeft = 60;
  let answers = [];
  let overtime = 0;

  function startExam() {
    examName = examNameInput.value.trim();
    totalQuestions = parseInt(numQuestionsInput.value);

    if (!examName || isNaN(totalQuestions) || totalQuestions <= 0) {
      alert("Please enter a valid exam name and number of questions.");
      return;
    }

    startButton.style.display = "none";
    document.getElementById("setup").style.display = "none";
    examContainer.style.display = "block";

    answers = [];
    currentQuestion = 1;
    showQuestion();
  }

  function showQuestion() {
    questionText.textContent = `Q${currentQuestion}`;
    questionInput.value = "";
    startTimer();
  }

  function startTimer() {
    timeLeft = 60;
    overtime = 0;
    updateTimerDisplay();

    if (timer) clearInterval(timer);

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        overtime++;
        updateTimerDisplay(true);
        timerCircle.classList.add("overtime");
        if (overtime === 1) beep.play(); // Beep once at start of overtime
      }
    }, 1000);
  }

  function updateTimerDisplay(isOvertime = false) {
    if (isOvertime) {
      timerText.textContent = `-${String(overtime).padStart(2, "0")}`;
    } else {
      timerText.textContent = `${String(timeLeft).padStart(2, "0")}`;
      timerCircle.classList.remove("overtime");
    }
  }

  function nextQuestion() {
    const response = questionInput.value.trim();
    answers.push({
      question: `Q${currentQuestion}`,
      answer: response || "(No answer)",
      overtime: overtime > 0 ? `+${overtime} sec` : "On time",
    });

    clearInterval(timer);

    if (currentQuestion < totalQuestions) {
      currentQuestion++;
      showQuestion();
    } else {
      finishExam();
    }
  }

  function finishExam() {
    examContainer.style.display = "none";
    resultDiv.style.display = "block";

    const heading = document.createElement("h3");
    heading.textContent = `Results for "${examName}"`;
    resultDiv.appendChild(heading);

    answers.forEach((item, index) => {
      const p = document.createElement("p");
      p.textContent = `${item.question}: ${item.answer} (${item.overtime})`;
      resultDiv.appendChild(p);
    });
  }

  startButton.addEventListener("click", startExam);
  nextButton.addEventListener("click", nextQuestion);
};
