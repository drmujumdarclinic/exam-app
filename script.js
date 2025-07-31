// script.js
document.getElementById("examForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const examName = document.getElementById("examName").value.trim();
  const totalQuestions = parseInt(document.getElementById("totalQuestions").value);
  const totalTime = parseInt(document.getElementById("totalTime").value);
  const timePerQuestion = (totalTime * 60) / totalQuestions;

  const examData = {
    examName,
    totalQuestions,
    totalTime,
    timePerQuestion
  };

  localStorage.setItem("examData", JSON.stringify(examData));
  window.location.href = "timer.html";
});
