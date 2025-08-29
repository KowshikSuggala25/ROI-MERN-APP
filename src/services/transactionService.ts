import api from '../config/api';

export const transactionService = {
  async buyStock(data: { stockId: string; amount: number }) {
    const response = await api.post('/transactions/buy', data);
    return response.data;
  },

  async sellStock(data: { stockId: string; shares: number }) {
    const response = await api.post('/transactions/sell', data);
    return response.data;
  },

  async getUserTransactions(params?: any) {
    const response = await api.get('/transactions/my-transactions', { params });
    return response.data;
  },

  async getUserHoldings() {
    const response = await api.get('/transactions/my-holdings');
    return response.data;
  },

  async getAllTransactions(params?: any) {
    const response = await api.get('/transactions/all', { params });
    return response.data;
  }
};