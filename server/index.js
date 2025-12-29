const { loadTransactions, saveTransactions } = require("./utils/storage");

const { TRANSACTION_MODES } = require("./constants/transaction.constants");
const { validateTransaction } = require("./validators/transaction.validator");

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// JSON storage
let transactions = loadTransactions();


// GET all transactions
app.get("/api/transactions", (req, res) => {
  let result = [...transactions];

  const { mode, sort, order } = req.query;

  // FILTER by mode
  if (mode) {
    result = result.filter(t => t.mode === mode);
  }

  // SORT
  if (sort) {
    result.sort((a, b) => {
      if (typeof a[sort] === "string") {
        return order === "desc"
          ? b[sort].localeCompare(a[sort])
          : a[sort].localeCompare(b[sort]);
      }

      if (typeof a[sort] === "number") {
        return order === "desc"
          ? b[sort] - a[sort]
          : a[sort] - b[sort];
      }

      return 0;
    });
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

// POST new transaction
app.post("/api/transactions", (req, res) => {
  const error = validateTransaction(req.body);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  const newTransaction = {
    id: Date.now(),
    name: req.body.name.trim(),
    amt: req.body.amt,
    mode: req.body.mode
  };

  transactions.push(newTransaction);
  saveTransactions(transactions);

  res.status(201).json({
    success: true,
    data: newTransaction
  });
});

// UPDATE transaction
app.put("/api/transactions/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = transactions.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Transaction not found"
    });
  }

  const error = validateTransaction(req.body);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  transactions[index] = {
    id,
    name: req.body.name.trim(),
    amt: req.body.amt,
    mode: req.body.mode
  };

  saveTransactions(transactions);

  res.status(200).json({
    success: true,
    data: transactions[index]
  });
});

// DELETE transaction
app.delete("/api/transactions/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = transactions.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Transaction not found"
    });
  }

  const deleted = transactions.splice(index, 1)[0];
  saveTransactions(transactions);


  res.status(200).json({
    success: true,
    data: deleted
  });
});

// Global error handler (safety net)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
});

// GET analytics (income, expense, balance)
app.get("/api/analytics", (req, res) => {
  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  for (const t of transactions) {
    if (t.mode === "incoming") {
      totalIncome += t.amt;
      incomeCount++;
    } else if (t.mode === "outgoing") {
      totalExpense += t.amt;
      expenseCount++;
    }
  }

  const balance = totalIncome - totalExpense;

  res.status(200).json({
    success: true,
    data: {
      totalIncome,
      totalExpense,
      balance,
      incomeCount,
      expenseCount
    }
  });
});

//GET api health status
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Server is healthy",
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});