# Student Finance Tracker

## Project Overview

Student Finance Tracker is a web application designed to help students record, organize, and monitor their income and expenses. It provides a dashboard with financial summaries and visual reports to help users understand their spending habits.

## Features

* **Transaction management:** Add, edit, and delete income and expense transactions.
* **Dashboard summaries:** View total income, total expenses, balance, and additional spending statistics.
* **Visual reports:** View a category doughnut chart and a monthly income-versus-expenses chart.
* **Search and sorting:** Find transactions and organize them using available sorting controls.
* **Monthly budgets:** Set spending limits by category and receive warnings when a budget is exceeded.
* **Currency display:** Display amounts in Rwandan francs (RWF), US dollars (USD), or euros (EUR).
* **JSON export and import:** Export transaction data for backup and import previously exported data.
* **Local storage:** Keep transactions and budgets available after refreshing the browser.
* **Input validation:** Validate transaction input using the project's test page.

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Chart.js
* Browser Local Storage
* JSON

## How to Run the Project

1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` in a web browser.
4. Use the transaction form to add income and expenses.

An internet connection may be required to load Chart.js from its CDN.

## Testing

The following features have been manually tested:

* Adding, editing, and deleting transactions
* Dashboard totals and charts
* Transaction search and sorting
* Monthly budgets and budget warnings
* Currency display selection
* JSON export and import
* Data persistence after refreshing the browser

Open `tests.html` in a browser to access the project's input-validation test page, if included in the repository.

## Limitations

* Currency selection changes how amounts are displayed; it does not convert values using live exchange rates.
* Data is stored locally in the browser rather than in a shared online database. Data may not be available in a different browser or device.

## Author

Derrick Mugire
