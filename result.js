const examName = localStorage.getItem("examName");
const totalQuestions = parseInt(localStorage.getItem("totalQuestions"));
const timePerQuestion = parseFloat(localStorage.getItem("timePerQuestion"));
const actualTimes = JSON.parse(localStorage.getItem("actualTimes")) || [];

document.getElementById("examName").textContent = examName;
document.getElementById("totalQuestions").textContent = totalQuestions;
document.getElementById("perQuestionTime").textContent = formatTime(timePerQuestion);

const totalTaken = actualTimes.reduce((sum, val) => sum + val, 0);
const totalTarget = timePerQuestion * totalQuestions;
const extraTime = Math.max(0, totalTaken - totalTarget);

document.getElementById("totalTimeTaken").textContent = formatTime(totalTaken);
document.getElementById("extraTime").textContent = formatTime(extraTime);

// Chart
const ctx = document.getElementById("resultChart").getContext("2d");

const questionLabels = actualTimes.map((_, i) => `Q${i + 1}`);
const targetData = Array(actualTimes.length).fill((timePerQuestion).toFixed(2));
const actualData = actualTimes.map(t => t.toFixed(2));

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: questionLabels,
    datasets: [
      {
        label: 'Target Time (sec)',
        data: targetData,
        backgroundColor: '#d3d3d3',
      },
      {
        label: 'Actual Time (sec)',
        data: actualData,
        backgroundColor: '#ff8800',
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
