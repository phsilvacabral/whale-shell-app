import api from './api';

export const portfolioService = {
  async createPortfolio(name) {
    const response = await api.post('/portfolio', { name });
    return response.data;
  },

  async getPortfolios() {
    const response = await api.get('/portfolio');
    return response.data;
  },

  async addTransaction(portfolioId, transaction) {
    const response = await api.post('/transactions', {
      portfolio_id: portfolioId,
      ...transaction
    });
    return response.data;
  },

  async getTransactions(portfolioId) {
    const response = await api.get(`/transactions/${portfolioId}`);
    return response.data;
  },

  async deleteTransaction(transactionId) {
    const response = await api.delete(`/transactions/${transactionId}`);
    return response.data;
  },

  async getDashboard(portfolioId) {
    const response = await api.get(`/aggregation/dashboard/${portfolioId}`);
    return response.data;
  },

  async getTopCryptos() {
    const response = await api.get('/crypto/top');
    return response.data;
  },
};
