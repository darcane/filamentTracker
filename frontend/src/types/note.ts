export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  category: string;
}

export interface UpdateNoteRequest extends Partial<CreateNoteRequest> {}

// Predefined categories for notes
export const NOTE_CATEGORIES = [
  'Spool Weights',
  'Print Settings',
  'Maintenance',
  'Tips & Tricks',
  'Suppliers',
  'Other'
] as const;
