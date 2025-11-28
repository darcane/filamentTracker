import axios from 'axios';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/note';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for sending auth cookies
});

// Transform backend snake_case response to frontend camelCase
interface BackendNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const transformNote = (note: BackendNote): Note => ({
  id: note.id,
  title: note.title,
  content: note.content,
  category: note.category,
  createdAt: note.created_at,
  updatedAt: note.updated_at,
});

export const notesApi = {
  // Get all notes
  getAll: async (): Promise<Note[]> => {
    const response = await api.get<BackendNote[]>('/notes');
    return response.data.map(transformNote);
  },

  // Get note by ID
  getById: async (id: string): Promise<Note> => {
    const response = await api.get<BackendNote>(`/notes/${id}`);
    return transformNote(response.data);
  },

  // Create new note
  create: async (note: CreateNoteRequest): Promise<Note> => {
    const response = await api.post<BackendNote>('/notes', note);
    return transformNote(response.data);
  },

  // Update note
  update: async (id: string, updates: UpdateNoteRequest): Promise<Note> => {
    const response = await api.put<BackendNote>(`/notes/${id}`, updates);
    return transformNote(response.data);
  },

  // Delete note
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};

export default api;
