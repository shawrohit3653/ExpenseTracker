const netBalanceEl = document.getElementById('net-balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionListEl = document.getElementById('transaction-list');
const typeEl = document.getElementById('type');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const addBtn = document.getElementById('add-btn');

let netBalance = 0;
let totalIncome = 0;
let totalExpenses = 0;

// Chart.js Configuration
const ctx = document.getElementById('expenseChart').getContext('2d');
const expenseChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [0, 0], // Initial values for income and expenses
        backgroundColor: ['#4caf50', '#f44336'], // Colors for the chart
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
  },
});

// Update Chart Data
function updateChart() {
  expenseChart.data.datasets[0].data = [totalIncome, totalExpenses];
  expenseChart.update();
}

// Update Totals
function updateTotals() {
  netBalanceEl.textContent = `₹${netBalance}`;
  incomeEl.textContent = `₹${totalIncome}`;
  expensesEl.textContent = `₹${totalExpenses}`;
  updateChart();
}

// Add Transaction
function addTransaction() {
  const type = typeEl.value;
  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  if (description === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid description and amount.');
    return;
  }

  if (type === 'Income') {
    totalIncome += amount;
    netBalance += amount;
  } else if (type === 'Expense') {
    totalExpenses += amount;
    netBalance -= amount;
  }

  const row = document.createElement('tr');
  row.className = type === 'Income' ? 'income' : 'expense';
  row.innerHTML = `
    <td>${type}</td>
    <td>${description}</td>
    <td>₹${amount.toFixed(2)}</td>
  `;
  transactionListEl.appendChild(row);

  descriptionEl.value = '';
  amountEl.value = '';

  updateTotals();
}

addBtn.addEventListener('click', addTransaction);

// AI Panel Logic
const aiPanel = document.getElementById('ai-panel');
const openAiBtn = document.getElementById('open-ai');
const closeAiBtn = document.getElementById('close-ai');
const aiContent = document.getElementById('ai-content');
const aiQuery = document.getElementById('ai-query');
const sendAiBtn = document.getElementById('send-ai');

const API_KEY = "AIzaSyDgt6I8e6ktjFHeLVEXjyw2BwgUG-Gx4kE"; // Replace with your actual Google API key

openAiBtn.addEventListener('click', () => {
  aiPanel.style.left = '0';
});

closeAiBtn.addEventListener('click', () => {
  aiPanel.style.left = '-300px';
});

sendAiBtn.addEventListener('click', async () => {
  const query = aiQuery.value.trim();
  if (!query) return;

  // Display user's query
  aiContent.innerHTML += `<div><strong>You:</strong> ${query}</div>`;
  aiQuery.value = '';

  // Call Google Gemini API
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: query }] }],
        }),
      }
    );

    const data = await response.json();

    // Check for API errors
    if (!data || !data.candidates || data.candidates.length === 0) {
      throw new Error("Invalid response from API");
    }

    // Get the AI response
    const aiResponse = data.candidates[0].content.parts[0].text;

    // Display the AI response
    aiContent.innerHTML += `<div><strong>AI:</strong> ${aiResponse}</div>`;
  } catch (error) {
    console.error('Error:', error); // Log the error for debugging
    aiContent.innerHTML += `<div><strong>AI:</strong> Sorry, something went wrong!</div>`;
  }
});
