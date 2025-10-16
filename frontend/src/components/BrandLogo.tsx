import React from 'react';
import { Box } from '@mui/material';
import { getBrandLogo, getBrandInitials, hasBrandLogo } from '../utils/brandLogos';

interface BrandLogoProps {
  brand: string;
  size?: number;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ brand, size = 32 }) => {
  const logoPath = getBrandLogo(brand);
  const initials = getBrandInitials(brand);
  const [imageError, setImageError] = React.useState(false);

  if (hasBrandLogo(brand) && logoPath && !imageError) {
    return (
      <Box
        component="img"
        src={logoPath}
        alt={`${brand} logo`}
        sx={{ 
          width: size * 1.5, 
          height: size,
          borderRadius: 1,
          objectFit: 'contain',
          minWidth: size * 1.5,
        }}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <Box
      sx={{ 
        width: size * 1.5, 
        height: size,
        bgcolor: 'primary.main',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.3,
        fontWeight: 'bold',
        color: 'white',
        minWidth: size * 1.5,
      }}
    >
      {initials}
    </Box>
  );
};

export default BrandLogo;
