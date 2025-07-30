document.getElementById('setupForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const examName = document.getElementById('examName').value;
  const totalQuestions = parseInt(document.getElementById('totalQuestions').value);
  const totalTime = parseFloat(document.getElementById('totalTime').value);

  const timePerQuestion = (totalTime * 60) / totalQuestions; // in seconds

  // Store in localStorage or pass via URL params
  localStorage.setItem('examName', examName);
  localStorage.setItem('totalQuestions', totalQuestions);
  localStorage.setItem('timePerQuestion', timePerQuestion);

  // Navigate to timer screen
  window.location.href = 'timer.html';
});
