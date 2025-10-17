import axios from 'axios';
import { LoginRequest, AuthResponse, User } from '../types/auth';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

export const authApi = {
  // Request magic link login
  login: async (email: string): Promise<{ message: string; email: string }> => {
    const response = await api.post('/auth/login', { email });
    return response.data;
  },

  // Verify magic link token (handled by redirect)
  verifyToken: async (token: string): Promise<AuthResponse> => {
    const response = await api.get(`/auth/verify?token=${token}`);
    return response.data;
  },

  // Verify 6-digit code
  verifyCode: async (email: string, code: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-code', { email, code });
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;
