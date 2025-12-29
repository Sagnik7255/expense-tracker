const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/transactions.json");

function loadTransactions() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file missing or corrupted, fail safely
    return [];
  }
}

function saveTransactions(transactions) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
}

module.exports = {
  loadTransactions,
  saveTransactions
};
