// Simulated multiple results using localStorage array
// We'll store results under key "examResults" as an array of objects

function loadResults() {
  const results = JSON.parse(localStorage.getItem("examResults")) || [];

  const listContainer = document.getElementById("resultList");
  listContainer.innerHTML = "";

  if (results.length === 0) {
    listContainer.innerHTML = "<p>No previous results found.</p>";
    return;
  }

  // Create buttons for each result
  results.forEach((result, index) => {
    const btn = document.createElement("button");
    btn.textContent = `${index + 1}. ${result.examName} (${result.date})`;
    btn.onclick = () => showChart(result);
    listContainer.appendChild(btn);
  });

  // Show latest result chart by default
  showChart(results[results.length - 1]);
}

function showChart(data) {
  const ctx = document.getElementById("dashboardChart").getContext("2d");

  if (Chart.getChart("dashboardChart")) {
    Chart.getChart("dashboardChart").destroy();
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.questionTimings.map(q => `Q${q.question}`),
      datasets: [
        {
          label: "Target Time (s)",
          data: Array(data.totalQuestions).fill(data.perQuestionTime),
          backgroundColor: "rgba(54, 162, 235, 0.6)"
        },
        {
          label: "Time Taken (s)",
          data: data.questionTimings.map(q => q.timeTaken),
          backgroundColor: "rgba(255, 99, 132, 0.6)"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

loadResults();
