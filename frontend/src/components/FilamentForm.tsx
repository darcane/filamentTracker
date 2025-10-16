import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { CreateFilamentRequest, BRAND_OPTIONS, FILAMENT_TYPE_OPTIONS, TYPE_MODIFIER_OPTIONS, COLOR_OPTIONS, CURRENCY_OPTIONS } from '../types/filament';
import { filamentApi } from '../services/api';

interface FilamentFormProps {
  onFilamentAdded: (filament: any) => void;
  onError: (error: string) => void;
}

const FilamentForm: React.FC<FilamentFormProps> = ({ onFilamentAdded, onError }) => {
  const [formData, setFormData] = useState<CreateFilamentRequest>({
    brand: '',
    filamentType: '',
    typeModifier: 'Standard',
    color: '',
    amount: 1000, // Default 1000 grams
    cost: 0,
    currency: 'SEK',
  });

  const [loading, setLoading] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const handleInputChange = (field: keyof CreateFilamentRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'amount' || field === 'cost' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.brand || !formData.filamentType || !formData.color) {
      onError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const newFilament = await filamentApi.create(formData);
      onFilamentAdded(newFilament);
      
      // Show feedback about what was added
      setLastAdded(`${formData.brand} ${formData.filamentType} ${formData.color}`);
      
      // Keep form values for quick add (don't reset)
      // Only reset the amount to default for next entry
      setFormData(prev => ({
        ...prev,
        amount: 1000,
      }));
      
    } catch (error) {
      onError('Failed to add filament');
      console.error('Error adding filament:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Filament
      </Typography>
      
      {lastAdded && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Last added: {lastAdded}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Brand</InputLabel>
              <Select
                value={formData.brand}
                onChange={handleInputChange('brand')}
                label="Brand"
              >
                {BRAND_OPTIONS.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Filament Type</InputLabel>
              <Select
                value={formData.filamentType}
                onChange={handleInputChange('filamentType')}
                label="Filament Type"
              >
                {FILAMENT_TYPE_OPTIONS.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type Modifier</InputLabel>
              <Select
                value={formData.typeModifier || 'Standard'}
                onChange={handleInputChange('typeModifier')}
                label="Type Modifier"
              >
                {TYPE_MODIFIER_OPTIONS.map((modifier) => (
                  <MenuItem key={modifier} value={modifier}>
                    {modifier}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Color"
              value={formData.color}
              onChange={handleInputChange('color')}
              placeholder="e.g., Bambu Lab Gray, Wood Brown, etc."
              required
              helperText="Enter any color name or description"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Amount (grams)"
              type="number"
              value={formData.amount}
              onChange={handleInputChange('amount')}
              inputProps={{ min: 0, step: 1 }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Cost"
              type="number"
              value={formData.cost}
              onChange={handleInputChange('cost')}
              inputProps={{ min: 0, step: 0.01 }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Currency</InputLabel>
              <Select
                value={formData.currency}
                onChange={handleInputChange('currency')}
                label="Currency"
              >
                {CURRENCY_OPTIONS.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
              disabled={loading}
              sx={{ height: '56px' }}
            >
              {loading ? 'Adding...' : 'Add Filament'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default FilamentForm;
