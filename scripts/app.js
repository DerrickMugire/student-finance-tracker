
document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");

    const totalIncomeElement = document.getElementById("total-income");
    const totalExpensesElement = document.getElementById("total-expenses");
    const balanceElement = document.getElementById("balance");
    const categoryList = document.getElementById("category-list");

    const transactions = JSON.parse(
        localStorage.getItem("transactions")
    ) || [];

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
        balanceElement.textContent = (totalIncome - totalExpenses).toFixed(2);

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

                row.remove();
                updateSummary();
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
    }

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

        transactions.push(transaction);

        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );

        displayTransaction(transaction);
        updateSummary();
        transactionForm.reset();
    });

    transactions.forEach(function (transaction) {
        displayTransaction(transaction);
    });

    updateSummary();
});

