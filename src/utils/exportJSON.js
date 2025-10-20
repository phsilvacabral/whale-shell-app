export function exportPortfolioJSON(portfolio) {
  const data = {
    portfolio_name: portfolio.name,
    exported_at: new Date().toISOString(),
    version: '1.0',
    transactions: portfolio.transactions.map(t => ({
      id: t.id,
      symbol: t.symbol,
      quantity: t.quantity,
      price_paid: t.price_paid,
      date: t.date || t.created_at,
    })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `whale-portfolio-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
