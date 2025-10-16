import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Filament } from '../types/filament';
import BrandLogo from './BrandLogo';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  filament: Filament | null;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  filament,
}) => {
  if (!filament) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description" sx={{ mb: 2 }}>
          Are you sure you want to delete this filament? This action cannot be undone.
        </DialogContentText>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          p: 2, 
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1 
        }}>
          <BrandLogo brand={filament.brand} size={40} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {filament.brand} {filament.filamentType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filament.typeModifier || 'Standard'} • {filament.color}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filament.amount}g • {filament.cost.toFixed(2)} {filament.currency}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
