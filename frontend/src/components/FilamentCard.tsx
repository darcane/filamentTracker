import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { Filament } from '../types/filament';
import BrandLogo from './BrandLogo';
import { useResponsive } from '../hooks/useMediaQuery';

interface FilamentCardProps {
  filament: Filament;
  onDelete: (filament: Filament) => void;
  onReduce: (filament: Filament) => void;
  getColorChipColor: (color: string) => 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const FilamentCard: React.FC<FilamentCardProps> = ({
  filament,
  onDelete,
  onReduce,
  getColorChipColor,
}) => {
  const { isMobile } = useResponsive();
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        elevation: 2,
        '&:hover': {
          elevation: 4,
        },
        // Ensure proper contrast in both light and dark modes
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: (theme) => theme.palette.mode === 'dark' 
          ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
          : '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Brand and Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BrandLogo brand={filament.brand} size={24} />
          <Typography variant="h6" component="h3" sx={{ userSelect: 'none', cursor: 'default' }}>
            {filament.brand}
          </Typography>
        </Box>

        {/* Type and Modifier */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={filament.filamentType}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={filament.typeModifier || 'Standard'}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>

        {/* Color */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={filament.color}
            size="small"
            color={getColorChipColor(filament.color)}
            variant="outlined"
          />
        </Box>

        {/* Amount and Cost */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary" sx={{ userSelect: 'none', cursor: 'default' }}>
              Amount
            </Typography>
            <Typography variant="h6" sx={{ userSelect: 'none', cursor: 'default' }}>
              {filament.amount.toLocaleString()}g
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary" sx={{ userSelect: 'none', cursor: 'default' }}>
              Cost
            </Typography>
            <Typography variant="h6" sx={{ userSelect: 'none', cursor: 'default' }}>
              {filament.cost.toFixed(2)} {filament.currency}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <Tooltip title="Reduce Amount">
          <IconButton
            size={isMobile ? "medium" : "small"}
            onClick={() => onReduce(filament)}
            color="warning"
            sx={{ minHeight: '48px', minWidth: '48px' }}
          >
            <RemoveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size={isMobile ? "medium" : "small"}
            onClick={() => onDelete(filament)}
            color="error"
            sx={{ minHeight: '48px', minWidth: '48px' }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default FilamentCard;
