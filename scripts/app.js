
document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");
   const transactionSearch =
    document.getElementById("transaction-search");

const sortTransactions =
    document.getElementById("sort-transactions");
    const totalIncomeElement = document.getElementById("total-income");
    const totalExpensesElement = document.getElementById("total-expenses");
    const balanceElement = document.getElementById("balance");
    const transactionCountElement =
    document.getElementById("transaction-count");

const averageExpenseElement =
    document.getElementById("average-expense");

const largestExpenseElement =
    document.getElementById("largest-expense");
    const categoryList = document.getElementById("category-list");
    const monthlySummaryList =
    document.getElementById("monthly-summary-list");
const budgetForm = document.getElementById("budget-form");
const budgetCategory = document.getElementById("budget-category");
const budgetAmount = document.getElementById("budget-amount");
const budgetList = document.getElementById("budget-list");
const budgets = JSON.parse(
    localStorage.getItem("budgets")
) || {};
    const transactions = JSON.parse(
        localStorage.getItem("transactions")
    ) || [];
    let editingTransaction = null;

        
function updateSummary() {
    let totalIncome = 0;
    let totalExpenses = 0;
    const expensesByCategory = {};

    transactions.forEach(function (transaction) {
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;

            const category = transaction.category || "Other";

            if (expensesByCategory[category] === undefined) {
                expensesByCategory[category] = 0;
            }

            expensesByCategory[category] += transaction.amount;
        }
    });

    totalIncomeElement.textContent = totalIncome.toFixed(2);
    totalExpensesElement.textContent = totalExpenses.toFixed(2);
    balanceElement.textContent =
        (totalIncome - totalExpenses).toFixed(2);

    transactionCountElement.textContent = transactions.length;

    const expenses = transactions.filter(function (transaction) {
        return transaction.type === "expense";
    });

    const totalExpenseAmount = expenses.reduce(function (total, transaction) {
        return total + transaction.amount;
    }, 0);

    const averageExpense = expenses.length > 0
        ? totalExpenseAmount / expenses.length
        : 0;

    const largestExpense = expenses.length > 0
        ? Math.max(...expenses.map(function (transaction) {
            return transaction.amount;
        }))
        : 0;

    averageExpenseElement.textContent = averageExpense.toFixed(2);
    largestExpenseElement.textContent = largestExpense.toFixed(2);

    categoryList.innerHTML = "";

    const categories = Object.keys(expensesByCategory);

    if (categories.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No expenses recorded yet.";
        categoryList.appendChild(item);
    } else {
        categories.forEach(function (category) {
            const item = document.createElement("li");

            item.textContent =
                category + ": " +
                expensesByCategory[category].toFixed(2);

            categoryList.appendChild(item);
        });
    }

    monthlySummaryList.innerHTML = "";

    const monthlyTotals = {};

    transactions.forEach(function (transaction) {
        const month = transaction.date.slice(0, 7);

        if (!monthlyTotals[month]) {
            monthlyTotals[month] = {
                income: 0,
                expenses: 0
            };
        }

        if (transaction.type === "income") {
            monthlyTotals[month].income += transaction.amount;
        } else {
            monthlyTotals[month].expenses += transaction.amount;
        }
    });

    const months = Object.keys(monthlyTotals).sort().reverse();

    if (months.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.textContent = "No monthly data available yet.";

        row.appendChild(cell);
        monthlySummaryList.appendChild(row);
    } else {
        months.forEach(function (month) {
            const totals = monthlyTotals[month];
            const row = document.createElement("tr");

            const monthCell = document.createElement("td");
            monthCell.textContent = month;

            const incomeCell = document.createElement("td");
            incomeCell.textContent = totals.income.toFixed(2);

            const expensesCell = document.createElement("td");
            expensesCell.textContent = totals.expenses.toFixed(2);

            const balanceCell = document.createElement("td");
            balanceCell.textContent =
                (totals.income - totals.expenses).toFixed(2);

            row.append(
                monthCell,
                incomeCell,
                expensesCell,
                balanceCell
            );

            monthlySummaryList.appendChild(row);
        });
    }
}

function renderBudgets() {
    budgetList.innerHTML = "";

    const categories = Object.keys(budgets);

    if (categories.length === 0) {
        budgetList.textContent = "No budgets set yet.";
        return;
    }

    const currentMonth = new Date().toISOString().slice(0, 7);

    categories.forEach(function (category) {
        const spent = transactions.reduce(function (total, transaction) {
            if (
                transaction.type === "expense" &&
                transaction.category === category &&
                transaction.date.slice(0, 7) === currentMonth
            ) {
                return total + transaction.amount;
            }

            return total;
        }, 0);

        const limit = budgets[category];
        const remaining = limit - spent;

        const item = document.createElement("div");
        const heading = document.createElement("h4");
        const details = document.createElement("p");

        heading.textContent = category + " Budget";

        details.textContent =
            "Limit: " + limit.toFixed(2) +
            " | Spent this month: " + spent.toFixed(2) +
            " | Remaining: " + remaining.toFixed(2);

        item.append(heading, details);

        if (remaining < 0) {
            const warning = document.createElement("p");
            warning.textContent = "Budget exceeded!";
            item.appendChild(warning);
        }

        budgetList.appendChild(item);
    });
}

    function displayTransaction(transaction) {
        const row = document.createElement("tr");

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = transaction.description;

        const amountCell = document.createElement("td");
        amountCell.textContent = transaction.amount.toFixed(2);

        const typeCell = document.createElement("td");
        typeCell.textContent = transaction.type;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = transaction.category;

        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.date;

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";

        editButton.addEventListener("click", function () {
            editingTransaction = transaction;
            document.getElementById("description").value = transaction.description;
            document.getElementById("amount").value = transaction.amount;
            document.getElementById("type").value = transaction.type;
            document.getElementById("category").value = transaction.category;
            document.getElementById("date").value = transaction.date;

            transactionForm.scrollIntoView({ behavior: "smooth", block: "center" });
        });

        actionCell.appendChild(editButton);

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            const confirmed = confirm(
                "Are you sure you want to delete this transaction?"
            );

            if (!confirmed) {
                return;
            }

            const index = transactions.indexOf(transaction);

            if (index !== -1) {
                transactions.splice(index, 1);

                localStorage.setItem(
                    "transactions",
                    JSON.stringify(transactions)
                );

                 renderTransactions();
                updateSummary();
                renderBudgets();
            }
        });

        actionCell.appendChild(deleteButton);

        row.append(
            descriptionCell,
            amountCell,
            typeCell,
            categoryCell,
            dateCell,
            actionCell
        );

        transactionList.appendChild(row);
        applyTransactionSearch();
    }

function applyTransactionSearch() {
    const searchTerm = transactionSearch.value.trim().toLowerCase();
    const rows = transactionList.querySelectorAll("tr");

    rows.forEach(function (row) {
        const description = row.cells[0].textContent.toLowerCase();
        const category = row.cells[3].textContent.toLowerCase();

        const matchesSearch =
            description.includes(searchTerm) ||
            category.includes(searchTerm);

        row.hidden = !matchesSearch;
    });
}

transactionSearch.addEventListener("input", applyTransactionSearch);

    transactionForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const amountInput = document.getElementById("amount").value.trim();
        const descriptionPattern = /^\S(?:.*\S)?$/;
const amountPattern = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
const categoryPattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
const duplicateWordPattern = /\b(\w+)\s+\1\b/i;

const amountValue = Number(amountInput);

function isValidDate(dateString) {
    const datePattern =
        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!datePattern.test(dateString)) {
        return false;
    }

    const date = new Date(dateString + "T00:00:00");

    return (
        date.getFullYear() === Number(dateString.slice(0, 4)) &&
        date.getMonth() + 1 === Number(dateString.slice(5, 7)) &&
        date.getDate() === Number(dateString.slice(8, 10))
    );
}

        const transaction = {
            description: document.getElementById("description").value.trim(),
            amount: amountValue,
            type: document.getElementById("type").value,
            category: document.getElementById("category").value,
            date: document.getElementById("date").value
        };

       if (
    !descriptionPattern.test(transaction.description) ||
    duplicateWordPattern.test(transaction.description) ||
    !amountPattern.test(amountInput) ||
    !Number.isFinite(transaction.amount) ||
    transaction.amount <= 0 ||
    !categoryPattern.test(transaction.category) ||
  !isValidDate(transaction.date)
) {
    alert("Please check your description, amount, category, and date.");
    return;
}

        if (editingTransaction) {
            Object.assign(editingTransaction, transaction);
            editingTransaction = null;
        } else {
            transactions.push(transaction);
        }

        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );

        renderTransactions();
        updateSummary();
        renderBudgets();
        transactionForm.reset();
    });
    budgetForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const category = budgetCategory.value;
    const amount = Number(budgetAmount.value);

    if (!category || !Number.isFinite(amount) || amount <= 0) {
        alert("Please choose a category and enter a valid budget.");
        return;
    }

    budgets[category] = amount;

    localStorage.setItem("budgets", JSON.stringify(budgets));

    renderBudgets();
    budgetForm.reset();
});

    

    const exportButton = document.getElementById("export-transactions");
    const importFile = document.getElementById("import-file");

    if (exportButton) {
        exportButton.addEventListener("click", function () {
            const data = JSON.stringify(transactions, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "student-finance-transactions.json";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        });
    }

    if (importFile) {
        importFile.addEventListener("change", function () {
            const file = importFile.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = function () {
                try {
                    const imported = JSON.parse(reader.result);
                    const validDate = value => {
                        if (typeof value !== "string" ||
                            !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
                        const date = new Date(value + "T00:00:00");
                        return !Number.isNaN(date.getTime()) &&
                            date.getFullYear() === Number(value.slice(0, 4)) &&
                            date.getMonth() + 1 === Number(value.slice(5, 7)) &&
                            date.getDate() === Number(value.slice(8, 10));
                    };

                    const validTransactions = Array.isArray(imported) &&
                        imported.every(t =>
                            t &&
                            typeof t.description === "string" &&
                            t.description.trim() !== "" &&
                            typeof t.amount === "number" &&
                            Number.isFinite(t.amount) &&
                            t.amount > 0 &&
                            ["income", "expense"].includes(t.type) &&
                            typeof t.category === "string" &&
                            t.category.trim() !== "" &&
                            validDate(t.date)
                        );

                    if (!validTransactions) {
                        alert("Import failed: the JSON file has invalid transaction data.");
                        return;
                    }

                    const confirmed = confirm(
                        "Import " + imported.length +
                        " transactions? This will replace your current transactions."
                    );

                    if (!confirmed) return;

                    transactions.splice(0, transactions.length, ...imported);
                    localStorage.setItem("transactions", JSON.stringify(transactions));
                    renderTransactions();
                    updateSummary();
                    renderBudgets();
                    alert("Transactions imported successfully.");
                } catch (error) {
                    alert("Import failed: please choose a valid JSON backup file.");
                } finally {
                    importFile.value = "";
                }
            };

            reader.onerror = function () {
                alert("Could not read the selected file.");
                importFile.value = "";
            };

            reader.readAsText(file);
        });
    }

    function renderTransactions() {
        transactionList.innerHTML = "";

        const sortedTransactions = [...transactions];

        if (sortTransactions.value === "date-desc") {
            sortedTransactions.sort((a, b) =>
                b.date.localeCompare(a.date)
            );
        } else if (sortTransactions.value === "date-asc") {
            sortedTransactions.sort((a, b) =>
                a.date.localeCompare(b.date)
            );
        } else if (sortTransactions.value === "amount-desc") {
            sortedTransactions.sort((a, b) =>
                b.amount - a.amount
            );
        } else if (sortTransactions.value === "amount-asc") {
            sortedTransactions.sort((a, b) =>
                a.amount - b.amount
            );
        }

        sortedTransactions.forEach(function (transaction) {
            displayTransaction(transaction);
        });
    }

    sortTransactions.addEventListener("change", function () {
        renderTransactions();
    });

    renderTransactions();
    updateSummary();
    renderBudgets();
});

