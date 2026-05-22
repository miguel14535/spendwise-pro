export function saveTransactions(data) {
  localStorage.setItem(
    "spendwise_transactions",
    JSON.stringify(data)
  );
}

export function getTransactions() {
  const data = localStorage.getItem(
    "spendwise_transactions"
  );

  return data ? JSON.parse(data) : null;
}