import React from 'react';
import { Box, Typography } from '@mui/material';

interface AppLogoProps {
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'horizontal' | 'vertical' | 'icon-only';
}

const AppLogo: React.FC<AppLogoProps> = ({
  size = 'medium',
  showText = true,
  variant = 'horizontal'
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'xsmall':
        return { iconSize: 20, fontSize: 14, spacing: 0.5 };
      case 'small':
        return { iconSize: 24, fontSize: 16, spacing: 1 };
      case 'large':
        return { iconSize: 48, fontSize: 32, spacing: 2 };
      default:
        return { iconSize: 32, fontSize: 20, spacing: 1.5 };
    }
  };

  const { iconSize, fontSize, spacing } = getSizeConfig();

  const LogoIcon = () => (
    <Box
      sx={{
        width: iconSize,
        height: iconSize,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        cursor: 'default',
      }}
    >
      {/* Main container with inventory box concept */}
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: '12%',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          border: '2px solid #1565c0',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          cursor: 'default',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
        }}
      >
        {/* Filament spool inside inventory box */}
        <Box
          sx={{
            width: iconSize * 0.5,
            height: iconSize * 0.5,
            borderRadius: '50%',
            border: `2px solid rgba(255, 255, 255, 0.9)`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Inner spool details */}
          <Box
            sx={{
              width: iconSize * 0.3,
              height: iconSize * 0.3,
              borderRadius: '50%',
              border: `1.5px solid rgba(255, 255, 255, 0.7)`,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: iconSize * 0.15,
                height: iconSize * 0.15,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </Box>
        </Box>

        {/* Inventory label/barcode effect */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: iconSize * 0.6,
            height: 2,
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -1,
              left: '20%',
              width: '60%',
              height: 1,
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: 1,
            },
          }}
        />

        {/* Filament strand flowing out */}
        <Box
          sx={{
            position: 'absolute',
            right: -iconSize * 0.25,
            top: '50%',
            transform: 'translateY(-50%)',
            width: iconSize * 0.3,
            height: 2,
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 100%)',
            borderRadius: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -1,
              left: 0,
              width: '100%',
              height: 1,
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: 1,
            },
          }}
        />
      </Box>
    </Box>
  );

  if (!showText) {
    return <LogoIcon />;
  }

  if (variant === 'vertical') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing }}>
        <LogoIcon />
        <Typography
          variant="h6"
          sx={{
            fontSize,
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            userSelect: 'none',
            cursor: 'default',
          }}
        >
          Filamentory
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing, userSelect: 'none', cursor: 'default' }}>
      <LogoIcon />
      <Typography
        variant="h6"
        sx={{
          fontSize,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          userSelect: 'none',
          cursor: 'default',
        }}
      >
        Filamentory
      </Typography>
    </Box>
  );
};

export default AppLogo;