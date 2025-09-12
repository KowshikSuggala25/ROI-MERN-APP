import api from '../config/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user'; // ✅ Added role
}

interface AuthResponse {
  user: any;
  token: string;
  message: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data); // ✅ no duplicate /api
      return response.data;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', data); // ✅ no duplicate /api
      return response.data;
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile'); // ✅ clean path
      return response.data;
    } catch (error: any) {
      console.error('Get profile failed:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateProfile(data: any) {
    try {
      const response = await api.put('/auth/profile', data); // ✅ clean path
      return response.data;
    } catch (error: any) {
      console.error('Update profile failed:', error.response?.data || error.message);
      throw error;
    }
  }
};
