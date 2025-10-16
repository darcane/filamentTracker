import axios from 'axios';
import { Filament, CreateFilamentRequest, UpdateFilamentRequest, ReduceAmountRequest } from '../types/filament';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const filamentApi = {
  // Get all filaments
  getAll: async (): Promise<Filament[]> => {
    const response = await api.get('/filaments');
    return response.data;
  },

  // Get filament by ID
  getById: async (id: string): Promise<Filament> => {
    const response = await api.get(`/filaments/${id}`);
    return response.data;
  },

  // Create new filament
  create: async (filament: CreateFilamentRequest): Promise<Filament> => {
    const response = await api.post('/filaments', filament);
    return response.data;
  },

  // Update filament
  update: async (id: string, updates: UpdateFilamentRequest): Promise<Filament> => {
    const response = await api.put(`/filaments/${id}`, updates);
    return response.data;
  },

  // Delete filament
  delete: async (id: string): Promise<void> => {
    await api.delete(`/filaments/${id}`);
  },

  // Reduce filament amount (for Home Assistant integration)
  reduceAmount: async (id: string, amount: number): Promise<Filament> => {
    const response = await api.patch(`/filaments/${id}/reduce`, { amount });
    return response.data;
  },
};

export default api;
