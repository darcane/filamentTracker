import React, { useState, useMemo } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { Filament, BRAND_OPTIONS, FILAMENT_TYPE_OPTIONS, TYPE_MODIFIER_OPTIONS } from '../types/filament';
import { filamentApi } from '../services/api';
import BrandLogo from './BrandLogo';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface FilamentTableProps {
  filaments: Filament[];
  loading: boolean;
  onFilamentUpdated: (filament: Filament) => void;
  onFilamentDeleted: (id: string) => void;
  onFilamentReduced: (filament: Filament) => void;
  onError: (error: string) => void;
}

type SortField = keyof Filament;
type SortDirection = 'asc' | 'desc';

const FilamentTable: React.FC<FilamentTableProps> = ({
  filaments,
  loading,
  onFilamentUpdated,
  onFilamentDeleted,
  onFilamentReduced,
  onError,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modifierFilter, setModifierFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filamentToDelete, setFilamentToDelete] = useState<Filament | null>(null);

  // Filter and sort filaments
  const filteredAndSortedFilaments = useMemo(() => {
    let filtered = filaments.filter(filament => {
      const matchesSearch = searchTerm === '' || 
        Object.values(filament).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesBrand = brandFilter === '' || filament.brand === brandFilter;
      const matchesType = typeFilter === '' || filament.filamentType === typeFilter;
      const matchesModifier = modifierFilter === '' || (filament.typeModifier || 'Standard') === modifierFilter;
      return matchesSearch && matchesBrand && matchesType && matchesModifier;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [filaments, searchTerm, brandFilter, typeFilter, modifierFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (filament: Filament) => {
    setFilamentToDelete(filament);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!filamentToDelete) return;

    try {
      await filamentApi.delete(filamentToDelete.id);
      onFilamentDeleted(filamentToDelete.id);
      setDeleteDialogOpen(false);
      setFilamentToDelete(null);
    } catch (error) {
      onError('Failed to delete filament');
      console.error('Error deleting filament:', error);
    }
  };

  const handleReduceAmount = async (filament: Filament) => {
    const amount = prompt(`Enter amount to reduce (current: ${filament.amount}g):`);
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      onError('Please enter a valid amount');
      return;
    }

    try {
      const updatedFilament = await filamentApi.reduceAmount(filament.id, Number(amount));
      onFilamentReduced(updatedFilament);
    } catch (error) {
      onError('Failed to reduce filament amount');
      console.error('Error reducing filament amount:', error);
    }
  };

  const getColorChipColor = (color: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const colorLower = color.toLowerCase();
    
    // Basic color detection
    if (colorLower.includes('red') || colorLower.includes('crimson') || colorLower.includes('scarlet')) return 'error';
    if (colorLower.includes('blue') || colorLower.includes('azure') || colorLower.includes('navy')) return 'primary';
    if (colorLower.includes('green') || colorLower.includes('emerald') || colorLower.includes('lime')) return 'success';
    if (colorLower.includes('yellow') || colorLower.includes('gold') || colorLower.includes('amber')) return 'warning';
    if (colorLower.includes('orange') || colorLower.includes('copper')) return 'warning';
    if (colorLower.includes('purple') || colorLower.includes('violet') || colorLower.includes('magenta')) return 'secondary';
    if (colorLower.includes('pink') || colorLower.includes('rose')) return 'secondary';
    if (colorLower.includes('brown') || colorLower.includes('wood') || colorLower.includes('tan')) return 'default';
    if (colorLower.includes('black') || colorLower.includes('charcoal')) return 'default';
    if (colorLower.includes('white') || colorLower.includes('ivory') || colorLower.includes('cream')) return 'default';
    if (colorLower.includes('gray') || colorLower.includes('grey') || colorLower.includes('silver')) return 'default';
    if (colorLower.includes('transparent') || colorLower.includes('clear')) return 'info';
    
    return 'default';
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading filaments...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ userSelect: 'none', cursor: 'default' }}>
        Filament Inventory ({filteredAndSortedFilaments.length} items)
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            label="Brand"
          >
            <MenuItem value="">All Brands</MenuItem>
            {BRAND_OPTIONS.map((brand) => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            label="Type"
          >
            <MenuItem value="">All Types</MenuItem>
            {FILAMENT_TYPE_OPTIONS.filter(type => 
              !['Carbon Fiber', 'Glass Fiber'].includes(type)
            ).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Modifier</InputLabel>
          <Select
            value={modifierFilter}
            onChange={(e) => setModifierFilter(e.target.value)}
            label="Modifier"
          >
            <MenuItem value="">All Modifiers</MenuItem>
            {TYPE_MODIFIER_OPTIONS.map((modifier) => (
              <MenuItem key={modifier} value={modifier}>
                {modifier}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      </Box>

      {/* Table */}
      <TableContainer sx={{ userSelect: 'none' }}>
        <Table sx={{ userSelect: 'none' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ userSelect: 'none', cursor: 'default' }}>Brand</TableCell>
              <TableCell sx={{ userSelect: 'none' }}>
                <TableSortLabel
                  active={sortField === 'filamentType'}
                  direction={sortField === 'filamentType' ? sortDirection : 'asc'}
                  onClick={() => handleSort('filamentType')}
                >
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ userSelect: 'none', cursor: 'default' }}>Modifier</TableCell>
              <TableCell sx={{ userSelect: 'none' }}>
                <TableSortLabel
                  active={sortField === 'color'}
                  direction={sortField === 'color' ? sortDirection : 'asc'}
                  onClick={() => handleSort('color')}
                >
                  Color
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ userSelect: 'none' }}>
                <TableSortLabel
                  active={sortField === 'amount'}
                  direction={sortField === 'amount' ? sortDirection : 'asc'}
                  onClick={() => handleSort('amount')}
                >
                  Amount (g)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ userSelect: 'none' }}>
                <TableSortLabel
                  active={sortField === 'cost'}
                  direction={sortField === 'cost' ? sortDirection : 'asc'}
                  onClick={() => handleSort('cost')}
                >
                  Cost
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ userSelect: 'none', cursor: 'default' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedFilaments.map((filament) => (
              <TableRow key={filament.id} hover>
                <TableCell sx={{ userSelect: 'none', cursor: 'default' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BrandLogo brand={filament.brand} size={24} />
                    {filament.brand}
                  </Box>
                </TableCell>
                <TableCell sx={{ userSelect: 'none', cursor: 'default' }}>{filament.filamentType}</TableCell>
                <TableCell sx={{ userSelect: 'none', cursor: 'default' }}>{filament.typeModifier || 'Standard'}</TableCell>
                <TableCell sx={{ userSelect: 'none', cursor: 'default' }}>
                  <Chip
                    label={filament.color}
                    size="small"
                    color={getColorChipColor(filament.color)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right" sx={{ userSelect: 'none', cursor: 'default' }}>{filament.amount.toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ userSelect: 'none', cursor: 'default' }}>
                  {filament.cost.toFixed(2)} {filament.currency}
                </TableCell>
                <TableCell sx={{ userSelect: 'none', cursor: 'default' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Reduce Amount">
                      <IconButton
                        size="small"
                        onClick={() => handleReduceAmount(filament)}
                        color="warning"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(filament)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredAndSortedFilaments.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No filaments found matching your criteria.
        </Alert>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        filament={filamentToDelete}
      />
    </Paper>
  );
};

export default FilamentTable;
