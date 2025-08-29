import api from '../config/api';

export const paymentService = {
  async uploadPaymentProof(formData: FormData) {
    const response = await api.post('/payments/upload-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getUserPayments(params?: any) {
    const response = await api.get('/payments/my-payments', { params });
    return response.data;
  },

  async getAllPayments(params?: any) {
    const response = await api.get('/payments/all', { params });
    return response.data;
  },

  async approvePayment(paymentId: string, adminNotes?: string) {
    const response = await api.patch(`/payments/${paymentId}/approve`, { adminNotes });
    return response.data;
  },

  async rejectPayment(paymentId: string, adminNotes?: string) {
    const response = await api.patch(`/payments/${paymentId}/reject`, { adminNotes });
    return response.data;
  }
};