import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Link,
  Alert,
} from '@mui/material';
import { Cookie as CookieIcon, Settings as SettingsIcon } from '@mui/icons-material';

interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentBannerProps {
  onConsentChange: (consent: CookieConsent) => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    analytics: false,
    marketing: false,
    preferences: true, // Essential cookies are always required
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const parsedConsent = JSON.parse(savedConsent);
      setConsent(parsedConsent);
      onConsentChange(parsedConsent);
    }
  }, []); // Remove onConsentChange from dependencies to prevent infinite loop

  const handleAcceptAll = () => {
    const newConsent = {
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setConsent(newConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    setShowBanner(false);
    onConsentChange(newConsent);
  };

  const handleAcceptEssential = () => {
    const newConsent = {
      analytics: false,
      marketing: false,
      preferences: true,
    };
    setConsent(newConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    setShowBanner(false);
    onConsentChange(newConsent);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowPreferences(false);
    setShowBanner(false);
    onConsentChange(consent);
  };

  const handleConsentChange = (type: keyof CookieConsent) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConsent(prev => ({
      ...prev,
      [type]: event.target.checked,
    }));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          zIndex: 1300,
          borderRadius: 0,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
          <CookieIcon sx={{ fontSize: 40, flexShrink: 0 }} />
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
              We use cookies to enhance your experience
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              We use essential cookies to make our site work. We'd also like to set analytics cookies to help us improve it. 
              We won't set optional cookies unless you enable them. Using this tool will set a cookie on your device to remember your preferences.
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPreferences(true);
                }}
                sx={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'underline' }}
              >
                Cookie preferences
              </Link>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            <Button
              variant="outlined"
              onClick={handleAcceptEssential}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Essential Only
            </Button>
            <Button
              variant="contained"
              onClick={handleAcceptAll}
              sx={{
                backgroundColor: 'white',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Accept All
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Cookie Preferences Dialog */}
      <Dialog
        open={showPreferences}
        onClose={() => setShowPreferences(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          Cookie Preferences
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            You can change your cookie preferences at any time. Essential cookies are required for the site to function properly.
          </Alert>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Essential Cookies
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These cookies are necessary for the website to function and cannot be switched off in our systems.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={consent.preferences}
                  disabled
                  color="primary"
                />
              }
              label="Essential cookies (always active)"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analytics Cookies
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={consent.analytics}
                  onChange={handleConsentChange('analytics')}
                  color="primary"
                />
              }
              label="Analytics cookies"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Marketing Cookies
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These cookies may be set through our site by our advertising partners to build a profile of your interests.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={consent.marketing}
                  onChange={handleConsentChange('marketing')}
                  color="primary"
                />
              }
              label="Marketing cookies"
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            For more information about how we use cookies, please see our{' '}
            <Link href="/privacy" target="_blank">
              Privacy Policy
            </Link>
            .
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowPreferences(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePreferences}
          >
            Save Preferences
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CookieConsentBanner;
