document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("examResultData"));


  // Save current result as main
localStorage.setItem("examResultData", JSON.stringify(result));

// Append to history array for dashboard
let history = JSON.parse(localStorage.getItem("examResults")) || [];
result.date = new Date().toLocaleString(); // Add timestamp
history.push(result);
localStorage.setItem("examResults", JSON.stringify(history));

  

  if (!data) {
    alert("No exam data found!");
    return;
  }

  const { examName, totalQuestions, perQuestionTime, questionTimings } = data;

  // Prepare chart data
  const labels = questionTimings.map(q => `Q${q.question}`);
  const actualTimes = questionTimings.map(q => q.timeTaken);
  const targetTimes = Array(totalQuestions).fill(perQuestionTime);

  document.getElementById("examTitle").textContent = `${examName} - Result`;

  const ctx = document.getElementById("resultChart").getContext("2d");

  if (Chart.getChart("resultChart")) {
  Chart.getChart("resultChart").destroy();
}

  
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Target Time (s)",
          data: targetTimes,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
          label: "Time Taken (s)",
          data: actualTimes,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        }
      }
    }
  });

  // PDF Download
  document.getElementById("downloadBtn").addEventListener("click", () => {
    const canvas = document.getElementById('resultChart');
    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text(`${examName} - Result Chart`, 20, 20);
    pdf.addImage(imgData, 'PNG', 15, 30, 180, 90);

    pdf.setFontSize(12);
    questionTimings.forEach((q, index) => {
      pdf.text(`Q${q.question}: Target ${perQuestionTime}s | Actual ${q.timeTaken}s`, 20, 130 + index * 6);
    });

    pdf.save(`${examName}_Result.pdf`);
  });
});
