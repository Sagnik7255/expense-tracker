const { TRANSACTION_MODES } = require("../constants/transaction.constants");

function validateTransaction({ name, amt, mode }) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "Transaction name must be a non-empty string";
  }

  if (typeof amt !== "number" || isNaN(amt) || amt <= 0) {
    return "Amount must be a positive number";
  }

  if (![TRANSACTION_MODES.INCOME, TRANSACTION_MODES.EXPENSE].includes(mode)) {
    return "Mode must be either 'incoming' or 'outgoing'";
  }

  return null;
}

module.exports = {
  validateTransaction
};
