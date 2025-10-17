import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { Note, CreateNoteRequest, NOTE_CATEGORIES } from '../types/note';
import { notesApi } from '../services/notesApi';

interface NotesSectionProps {
  onError: (error: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ onError }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<CreateNoteRequest>({
    title: '',
    content: '',
    category: 'Spool Weights',
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      // For now, we'll use localStorage since we don't have API endpoints yet
      const savedNotes = localStorage.getItem('filament-notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      onError('Failed to load notes');
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = (newNotes: Note[]) => {
    localStorage.setItem('filament-notes', JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  const handleOpenDialog = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category,
      });
    } else {
      setEditingNote(null);
      setFormData({
        title: '',
        content: '',
        category: 'Spool Weights',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      category: 'Spool Weights',
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      onError('Please fill in both title and content');
      return;
    }

    const now = new Date().toISOString();
    
    if (editingNote) {
      // Update existing note
      const updatedNote: Note = {
        ...editingNote,
        ...formData,
        updatedAt: now,
      };
      const updatedNotes = notes.map(n => n.id === editingNote.id ? updatedNote : n);
      saveNotes(updatedNotes);
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(), // Simple ID generation for now
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      saveNotes([...notes, newNote]);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    saveNotes(updatedNotes);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      'Spool Weights': 'info',
      'Print Settings': 'primary',
      'Maintenance': 'warning',
      'Tips & Tricks': 'success',
      'Suppliers': 'secondary',
      'Other': 'default',
    };
    return colors[category] || 'default';
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading notes...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotesIcon color="primary" />
          <Typography variant="h6" sx={{ userSelect: 'none', cursor: 'default' }}>
            Notes & Helpers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Note
        </Button>
      </Box>

      {notes.length === 0 ? (
        <Alert severity="info">
          No notes yet. Click "Add Note" to create your first note, such as spool weights or print settings.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ flexGrow: 1, mr: 1, userSelect: 'none', cursor: 'default' }}>
                      {note.title}
                    </Typography>
                    <Chip
                      label={note.category}
                      size="small"
                      color={getCategoryColor(note.category)}
                      variant="outlined"
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '4.5em',
                      userSelect: 'none',
                      cursor: 'default',
                    }}
                  >
                    {note.content}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ userSelect: 'none', cursor: 'default' }}>
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(note)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(note.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ userSelect: 'none', cursor: 'default' }}>
          {editingNote ? 'Edit Note' : 'Add New Note'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Bambu Lab Spool Weight"
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                label="Category"
              >
                {NOTE_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter your note content here..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingNote ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default NotesSection;
