const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const date = document.getElementById('date');
const categorySelect = document.getElementById('category');

const budgetInput = document.getElementById('budget');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const dueDisplay = document.getElementById('dueDisplay');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budget = localStorage.getItem('budget') ? +localStorage.getItem('budget') : 0;

// Save and load helpers
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}
function saveBudget() {
  localStorage.setItem('budget', budget);
}

// Set Budget button
if (setBudgetBtn) {
  setBudgetBtn.addEventListener('click', () => {
    const val = +budgetInput.value;
    if (val > 0) {
      budget = val;
      saveBudget();
      updateUI();
      alert(`Budget set to ₹${budget}`);
      budgetInput.value = '';
    } else {
      alert('Please enter a valid budget amount!');
    }
  });
}

form.addEventListener('submit', addTransaction);

function addTransaction(e) {
  e.preventDefault();

  const desc = text.value.trim();
  const amt = +amount.value;
  const txDate = date.value;
  const cat = categorySelect.value;

  if (desc === '' || isNaN(amt) || txDate === '') return;

  const transaction = {
    id: Date.now(),
    text: desc,
    amount: amt,
    date: txDate,
    category: cat
  };

  transactions.push(transaction);
  saveTransactions();

  text.value = '';
  amount.value = '';
  date.value = '';
  categorySelect.value = 'Food'; // Reset category if you want

  updateUI();
}

function updateUI() {
  list.innerHTML = '';

  let total = 0,
    incomeTotal = 0,
    expenseTotal = 0;

  // Group transactions by date
  const grouped = transactions.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {});

  for (const [txDate, txList] of Object.entries(grouped)) {
    const dateBlock = document.createElement('div');
    dateBlock.className = 'date-group';

    const heading = document.createElement('h4');
    heading.innerText = `Date: ${txDate}`;
    dateBlock.appendChild(heading);

    const ul = document.createElement('ul');
    ul.className = 'list';

    txList.forEach(t => {
      const sign = t.amount < 0 ? '-' : '+';
      const li = document.createElement('li');
      li.classList.add(t.amount < 0 ? 'minus' : 'plus');
      li.innerHTML = `
        ${t.text} (${t.category || 'Uncategorized'})
        <span>${sign}₹${Math.abs(t.amount)}</span>
      `;
      ul.appendChild(li);

      total += t.amount;
      if (t.amount > 0) incomeTotal += t.amount;
      else expenseTotal += t.amount;
    });

    dateBlock.appendChild(ul);
    list.appendChild(dateBlock);
  }

  balance.innerText = `₹${total}`;
  income.innerText = `₹${incomeTotal}`;
  expense.innerText = `₹${Math.abs(expenseTotal)}`;

  if (budget > 0) {
    const totalExpenses = Math.abs(expenseTotal);
    const due = budget - totalExpenses;
    dueDisplay.innerText = `Remaining Budget: ₹${due >= 0 ? due : 0}`;

    if (due === 0 && !localStorage.getItem('budgetAlertShown')) {
      alert('Your remaining budget is ₹0. You have reached your limit!');
      localStorage.setItem('budgetAlertShown', 'true');
    } else if (due > 0) {
      localStorage.removeItem('budgetAlertShown');
    }
  } else {
    dueDisplay.innerText = '';
  }

}
// Export CSV function (call on button click)
function exportToCSV() {
  let csv = "Description,Amount,Date,Category\n";
  transactions.forEach(t => {
    csv += `${t.text},${t.amount},${t.date},${t.category || ''}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "transactions.csv";
  link.click();
}
function clearTransactions() {
  if (confirm('Are you sure you want to clear all transactions?')) {
    transactions = [];
    saveTransactions();
    updateUI();
  }
}
// Initialize on load
function updateUI() {
  list.innerHTML = '';

  let total = 0,
    incomeTotal = 0,
    expenseTotal = 0;

  // Group transactions by date
  const grouped = transactions.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {});

  for (const [txDate, txList] of Object.entries(grouped)) {
    const dateBlock = document.createElement('div');
    dateBlock.className = 'date-group';

    const heading = document.createElement('h4');
    heading.innerText = `Date: ${txDate}`;
    dateBlock.appendChild(heading);

    const ul = document.createElement('ul');
    ul.className = 'list';

    txList.forEach(t => {
      const sign = t.amount < 0 ? '-' : '+';
      const li = document.createElement('li');
      li.classList.add(t.amount < 0 ? 'minus' : 'plus');
      li.innerHTML = `
        ${t.text} (${t.category || 'Uncategorized'})
        <span>${sign}₹${Math.abs(t.amount)}</span>
      `;
      ul.appendChild(li);

      total += t.amount;
      if (t.amount > 0) incomeTotal += t.amount;
      else expenseTotal += t.amount;
    });

    dateBlock.appendChild(ul);
    list.appendChild(dateBlock);
  }

  balance.innerText = `₹${total}`;
  income.innerText = `₹${incomeTotal}`;
  expense.innerText = `₹${Math.abs(expenseTotal)}`;

  if (budget > 0) {
    const totalExpenses = Math.abs(expenseTotal);
    const due = budget - totalExpenses;
    dueDisplay.innerText = `Remaining Budget: ₹${due >= 0 ? due : 0}`;

    if (due === 0 && !localStorage.getItem('budgetAlertShown')) {
      alert('Your remaining budget is ₹0. You have reached your limit!');
      localStorage.setItem('budgetAlertShown', 'true');
    } else if (due > 0) {
      localStorage.removeItem('budgetAlertShown');
    }
  } else {
    dueDisplay.innerText = '';
  }
}
// Initialize on load
updateUI();
