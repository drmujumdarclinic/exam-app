document.addEventListener("DOMContentLoaded", () => {
  const examName = localStorage.getItem("examName") || "Exam Result";
  const questionCount = parseInt(localStorage.getItem("questionCount"), 10) || 1;
  const targetTime = parseFloat(localStorage.getItem("targetTime")) || 60;
  const actualTimes = JSON.parse(localStorage.getItem("timePerQuestion")) || [];

  document.getElementById("examTitle").textContent = `${examName} - Result`;

  const labels = Array.from({ length: questionCount }, (_, i) => `Q${i + 1}`);
  const targetTimes = Array(questionCount).fill(targetTime);

  // Fill missing actualTimes with zeros (if any)
  const paddedActualTimes = Array.from({ length: questionCount }, (_, i) => actualTimes[i] || 0);

  const ctx = document.getElementById('resultChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Target Time (s)',
          data: targetTimes,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Time Taken (s)',
          data: paddedActualTimes,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Seconds'
          }
        }
      }
    }
  });

  // PDF Download
  document.getElementById('downloadBtn').addEventListener('click', () => {
    const canvas = document.getElementById('resultChart');
    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text(`${examName} - Result Chart`, 20, 20);
    pdf.addImage(imgData, 'PNG', 15, 30, 180, 90);

    pdf.setFontSize(12);
    paddedActualTimes.forEach((time, index) => {
      pdf.text(`Q${index + 1}: Target ${targetTime}s | Actual ${time}s`, 20, 130 + index * 6);
    });

    pdf.save(`${examName}_Result.pdf`);
  });
});
