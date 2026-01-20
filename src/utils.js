export function calculatePoints(amount) {
    if (amount <= 50) return 0;

    if (amount <= 100) return amount - 50;
    
    return 50 + (amount - 100) * 2;
}

export function processRewards(transactions) {
  const result = {}, rewards = {};

  transactions.forEach(tx => {
    const month = new Date(tx.date).toLocaleString("default", { month: "long" });
    const points = calculatePoints(tx.amount);

    if (!rewards[tx.name]) {
      rewards[tx.name] = { Total: 0 };
    }

    rewards[tx.name][month] = (rewards[tx.name][month] || 0) + points;
    rewards[tx.name].Total += points;
  });

  return rewards;
}