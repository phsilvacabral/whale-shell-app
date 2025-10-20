const STORAGE_KEY = 'whale_anonymous_portfolio';

export const anonymousService = {
  getPortfolio() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { name: 'Meu Portfolio', transactions: [] };
  },

  savePortfolio(portfolio) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  },

  addTransaction(transaction) {
    const portfolio = this.getPortfolio();
    portfolio.transactions.push({
      id: Date.now().toString(),
      transaction_type: 'buy', // Default para compatibilidade
      ...transaction,
      created_at: new Date().toISOString(),
    });
    this.savePortfolio(portfolio);
    return portfolio;
  },

  deleteTransaction(transactionId) {
    const portfolio = this.getPortfolio();
    portfolio.transactions = portfolio.transactions.filter(t => t.id !== transactionId);
    this.savePortfolio(portfolio);
    return portfolio;
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },

  async getTopCryptos() {
    // Para modo anônimo, usar dados simulados
    const mockData = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'btc',
        current_price: 43250.50,
        market_cap_rank: 1
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'eth',
        current_price: 2650.30,
        market_cap_rank: 2
      },
      {
        id: 'tether',
        name: 'Tether',
        symbol: 'usdt',
        current_price: 1.00,
        market_cap_rank: 3
      },
      {
        id: 'binancecoin',
        name: 'BNB',
        symbol: 'bnb',
        current_price: 315.80,
        market_cap_rank: 4
      },
      {
        id: 'solana',
        name: 'Solana',
        symbol: 'sol',
        current_price: 98.45,
        market_cap_rank: 5
      },
      {
        id: 'xrp',
        name: 'XRP',
        symbol: 'xrp',
        current_price: 0.62,
        market_cap_rank: 6
      },
      {
        id: 'usd-coin',
        name: 'USD Coin',
        symbol: 'usdc',
        current_price: 1.00,
        market_cap_rank: 7
      },
      {
        id: 'cardano',
        name: 'Cardano',
        symbol: 'ada',
        current_price: 0.48,
        market_cap_rank: 8
      },
      {
        id: 'avalanche-2',
        name: 'Avalanche',
        symbol: 'avax',
        current_price: 36.80,
        market_cap_rank: 9
      },
      {
        id: 'dogecoin',
        name: 'Dogecoin',
        symbol: 'doge',
        current_price: 0.08,
        market_cap_rank: 10
      },
      {
        id: 'chainlink',
        name: 'Chainlink',
        symbol: 'link',
        current_price: 14.25,
        market_cap_rank: 11
      },
      {
        id: 'polygon',
        name: 'Polygon',
        symbol: 'matic',
        current_price: 0.85,
        market_cap_rank: 12
      }
    ];

    return { success: true, data: mockData };
  },
};
