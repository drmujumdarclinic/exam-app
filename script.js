document.getElementById("examForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("examName").value;
  const questions = parseInt(document.getElementById("totalQuestions").value);
  const time = parseInt(document.getElementById("totalTime").value);

  const perQuestion = (time * 60) / questions;

  localStorage.setItem("examName", name);
  localStorage.setItem("totalQuestions", questions);
  localStorage.setItem("totalTime", time);
  localStorage.setItem("perQuestionTime", perQuestion);
  localStorage.setItem("currentQuestion", 1);
  localStorage.setItem("timings", JSON.stringify([]));

  window.location.href = "timer.html";
});
