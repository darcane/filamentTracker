import axios from 'axios';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/note';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notesApi = {
  // Get all notes
  getAll: async (): Promise<Note[]> => {
    const response = await api.get('/notes');
    return response.data;
  },

  // Get note by ID
  getById: async (id: string): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Create new note
  create: async (note: CreateNoteRequest): Promise<Note> => {
    const response = await api.post('/notes', note);
    return response.data;
  },

  // Update note
  update: async (id: string, updates: UpdateNoteRequest): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, updates);
    return response.data;
  },

  // Delete note
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};

export default api;
