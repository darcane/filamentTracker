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
  Collapse,
  IconButton,
  Chip,
  InputAdornment,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  ColorLens as ColorLensIcon,
  LocalOffer as LocalOfferIcon,
  Scale as ScaleIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { CreateFilamentRequest, BRAND_OPTIONS, FILAMENT_TYPE_OPTIONS, TYPE_MODIFIER_OPTIONS, CURRENCY_OPTIONS } from '../types/filament';
import { filamentApi } from '../services/api';

interface FilamentFormProps {
  onFilamentAdded: (filament: any) => void;
  onError: (error: string) => void;
}

const FilamentForm: React.FC<FilamentFormProps> = ({ onFilamentAdded, onError }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
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

      // Auto-collapse after successful add (optional)
      setTimeout(() => setLastAdded(null), 5000);

    } catch (error) {
      onError('Failed to add filament');
      console.error('Error adding filament:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.brand && formData.filamentType && formData.color;

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: theme.palette.mode === 'dark'
            ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`
            : `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
      {/* Header - Always Visible */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          p: 2.5,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: expanded
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
            : 'transparent',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              color: 'white',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <AddIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Add New Filament
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {expanded ? 'Fill in the details below' : 'Click to expand and add a new spool'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!expanded && isFormValid && (
            <Chip
              label="Ready to add"
              size="small"
              color="success"
              icon={<CheckCircleIcon />}
            />
          )}
          <IconButton
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Last Added Success Message */}
      {lastAdded && (
        <Box sx={{ px: 2.5, pb: 1 }}>
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{
              borderRadius: 1.5,
              animation: 'slideIn 0.3s ease-in-out',
              '@keyframes slideIn': {
                from: { opacity: 0, transform: 'translateY(-10px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            Successfully added: <strong>{lastAdded}</strong>
          </Alert>
        </Box>
      )}

      {/* Collapsible Form */}
      <Collapse in={expanded} timeout={300}>
        <Divider />
        <Box sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Brand & Type Section */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <LocalOfferIcon fontSize="small" />
                  Filament Details
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
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

              <Grid item xs={12} sm={6} md={4}>
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

              <Grid item xs={12} sm={6} md={4}>
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Color"
                  value={formData.color}
                  onChange={handleInputChange('color')}
                  placeholder="e.g., Bambu Lab Gray, Wood Brown, etc."
                  required
                  helperText="Enter any color name or description"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ColorLensIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Quantity & Pricing Section */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  sx={{
                    mb: 2,
                    mt: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ScaleIcon fontSize="small" />
                  Quantity & Pricing
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange('amount')}
                  inputProps={{ min: 0, step: 1 }}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Chip label="grams" size="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleInputChange('cost')}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
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

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setExpanded(false)}
                    sx={{ minWidth: 120 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                    disabled={loading || !isFormValid}
                    sx={{
                      minWidth: 160,
                      boxShadow: isFormValid
                        ? `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`
                        : 'none',
                      '&:hover': {
                        boxShadow: isFormValid
                          ? `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`
                          : 'none',
                      },
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Filament'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilamentForm;
