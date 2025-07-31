document.addEventListener("DOMContentLoaded", () => {
  const examData = JSON.parse(localStorage.getItem("examData"));
  const results = JSON.parse(localStorage.getItem("results"));

  if (!examData || !results) {
    alert("No result data found!");
    window.location.href = "index.html";
    return;
  }

  const { examName, timePerQuestion } = examData;
  document.getElementById("examTitle").textContent = `${examName} - Result`;

  const labels = results.map(r => `Q${r.question}`);
  const actualTimes = results.map(r => Math.max(0, r.timeTaken));
  const targetTimes = results.map(() => timePerQuestion);

  const ctx = document.getElementById('resultChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Target Time (sec)',
          data: targetTimes,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        },
        {
          label: 'Time Taken (sec)',
          data: actualTimes,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Time per Question'
        }
      }
    }
  });

  document.getElementById("downloadBtn").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`${examName} - Exam Result`, 10, 15);
    doc.setFontSize(12);
    doc.text(`Question-wise Time Summary`, 10, 25);

    results.forEach((r, index) => {
      const y = 35 + index * 8;
      doc.text(`Q${r.question}: Target ${Math.round(timePerQuestion)}s, Taken ${Math.round(r.timeTaken)}s`, 10, y);
    });

    doc.addPage();
    doc.setFontSize(14);
    doc.text('Bar Chart:', 10, 15);
    const chartCanvas = document.getElementById("resultChart");
    const chartImage = chartCanvas.toDataURL("image/png", 1.0);
    doc.addImage(chartImage, 'PNG', 10, 20, 180, 100);

    const filename = examName.replace(/\s+/g, "_") + "_Result.pdf";
    doc.save(filename);
  });
});

function downloadPDF() {
  const element = document.getElementById('resultSection');

  const opt = {
    margin:       0.5,
    filename:     'Exam_Result.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}
