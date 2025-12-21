const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// TEMP in-memory data
let transactions = [
  { id: 1, name: "Food", amt: 225.0, mode: "outgoing" },
  { id: 2, name: "Freelancing", amt: 4500.0, mode: "incoming" }
];

// GET all transactions
app.get("/api/transactions", (req, res) => {
  res.json(transactions);
});

// POST new transaction
app.post("/api/transactions", (req, res) => {
  const { name, amt, mode } = req.body;

  if (!name || !amt || !mode) {
    return res.status(400).json({ error: "Name, amount, and mode is required" });
  }

  const newTrans = {
    id: Date.now(),
    name,
    amt,
    mode
  };

  transactions.push(newTrans);
  res.status(201).json(newTrans);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

