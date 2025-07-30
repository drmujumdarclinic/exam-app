const examName = localStorage.getItem("examName");
const totalQuestions = parseInt(localStorage.getItem("totalQuestions"));
const timePerQuestion = parseFloat(localStorage.getItem("timePerQuestion"));
const actualTimes = JSON.parse(localStorage.getItem("actualTimes")) || [];

// UI Elements
document.getElementById("examName").textContent = examName;
document.getElementById("totalQuestions").textContent = totalQuestions;
document.getElementById("perQuestionTime").textContent = formatTime(timePerQuestion);

// Total Time Taken
const totalTaken = actualTimes.reduce((sum, val) => sum + val, 0);
const totalTarget = timePerQuestion * totalQuestions;
const extraTime = totalTaken - totalTarget;

document.getElementById("totalTimeTaken").textContent = formatTime(totalTaken);
document.getElementById("extraTime").textContent = formatTime(extraTime);

// Prepare data for chart
const questionLabels = actualTimes.map((_, i) => `Q${i + 1}`);
const actualDiffs = actualTimes.map(t => (t - timePerQuestion).toFixed(2)); // +/- difference

const ctx = document.getElementById("resultChart").getContext("2d");

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: questionLabels,
    datasets: [{
      label: 'Extra Time (+) or Saved Time (-) in seconds',
      data: actualDiffs,
      backgroundColor: actualDiffs.map(val => val >= 0 ? '#e74c3c' : '#2ecc71'), // red for extra, green for saved
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Time Difference (sec)'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const diff = context.parsed.y;
            if (diff >= 0) {
              return `Extra Time: +${diff}s`;
            } else {
              return `Saved Time: ${diff}s`;
            }
          }
        }
      }
    }
  }
});

// Utility function
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
