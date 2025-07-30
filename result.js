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


function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const tableData = [];
  let totalExtraTime = 0;

  for (let i = 0; i < timings.length; i++) {
    let timeTaken = timings[i];
    let extra = timeTaken - timePerQuestion;
    totalExtraTime += extra;

    tableData.push([
      i + 1,
      formatTime(timePerQuestion),
      formatTime(timeTaken),
      (extra >= 0 ? "+" : "") + formatTime(extra)
    ]);
  }

  // Header
  doc.setFontSize(16);
  doc.text("Exam Timer Full Report", 14, 20);

  // Table
  doc.autoTable({
    head: [["Q#", "Target Time", "Time Taken", "Extra Time"]],
    body: tableData,
    startY: 30,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 160, 133] }
  });

  // Summary
  const totalTimeTaken = timings.reduce((a, b) => a + b, 0);
  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.text(`Total Questions: ${timings.length}`, 14, finalY);
  doc.text(`Total Target Time: ${formatTime(timings.length * timePerQuestion)}`, 14, finalY + 7);
  doc.text(`Total Time Taken: ${formatTime(totalTimeTaken)}`, 14, finalY + 14);
  doc.text(`Total Extra Time: ${(totalExtraTime >= 0 ? "+" : "") + formatTime(totalExtraTime)}`, 14, finalY + 21);

  doc.save("Exam_Report.pdf");
}
