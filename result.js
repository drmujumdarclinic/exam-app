// Fetch result data from localStorage
const examName = localStorage.getItem("examName") || "Sample Exam";
const totalQuestions = parseInt(localStorage.getItem("totalQuestions") || "10");
const totalTime = parseInt(localStorage.getItem("totalTime") || "5"); // in minutes
const timeTaken = parseFloat(localStorage.getItem("timeTaken") || "5"); // in minutes
const extraTime = Math.max(0, timeTaken - totalTime);

// Update HTML content
document.getElementById("examName").textContent = examName;
document.getElementById("totalQuestions").textContent = totalQuestions;
document.getElementById("totalTime").textContent = totalTime;
document.getElementById("timeTaken").textContent = timeTaken.toFixed(2) + " mins";
document.getElementById("extraTime").textContent = extraTime > 0 ? extraTime.toFixed(2) + " mins" : "None";

// Create a chart using Chart.js
const ctx = document.getElementById('resultChart').getContext('2d');

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Total Time', 'Time Taken', 'Extra Time'],
    datasets: [{
      label: 'Time in minutes',
      data: [totalTime, timeTaken, extraTime],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
});

// Download as PDF
function downloadPDF() {
  const element = document.getElementById('resultSection');
  const opt = {
    margin:       0.5,
    filename:     `${examName}_Result.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}
