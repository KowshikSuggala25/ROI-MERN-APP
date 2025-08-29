import api from '../config/api';

export const stockService = {
  async getAllStocks(params?: any) {
    const response = await api.get('/stocks', { params });
    return response.data;
  },

  async getStockById(id: string) {
    const response = await api.get(`/stocks/${id}`);
    return response.data;
  },

  async createStock(data: any) {
    const response = await api.post('/stocks', data);
    return response.data;
  },

  async updateStock(id: string, data: any) {
    const response = await api.put(`/stocks/${id}`, data);
    return response.data;
  },

  async deleteStock(id: string) {
    const response = await api.delete(`/stocks/${id}`);
    return response.data;
  },

  async toggleStockStatus(id: string) {
    const response = await api.patch(`/stocks/${id}/toggle`);
    return response.data;
  }
};