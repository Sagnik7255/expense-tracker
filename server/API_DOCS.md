## Expense Tracker API

### GET /api/transactions
Returns all transactions.

### POST /api/transactions
Body:
{
  "name": string,
  "amt": number (>0),
  "mode": "incoming" | "outgoing"
}

### PUT /api/transactions/:id
Updates a transaction.

### DELETE /api/transactions/:id
Deletes a transaction.

### GET /api/analytics
Returns income, expense, balance.

### GET /api/health
Returns server status.
