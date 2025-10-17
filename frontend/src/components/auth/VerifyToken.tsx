import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material';
import { authApi } from '../../services/authApi';
import { useAuth } from '../../hooks/useAuth';

const VerifyToken: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { checkAuthStatus } = useAuth();

  const verifyToken = useCallback(async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await authApi.verifyToken(token);
      setSuccess(true);
      
      // Refresh auth status to get user data
      await checkAuthStatus();
      
      // Redirect to main app after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Token verification failed');
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus, navigate]);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('No verification token provided');
      setLoading(false);
      return;
    }

    verifyToken(token);
  }, [searchParams, verifyToken]);

  const handleRetry = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Verifying your magic link...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we sign you in.
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (success) {
    return (
      <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Success!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You've been signed in successfully. Redirecting to your dashboard...
          </Typography>
          <CircularProgress size={24} />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Verification Failed
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The magic link may have expired or already been used. Please request a new one.
        </Typography>
        
        <Button
          variant="contained"
          onClick={handleRetry}
          fullWidth
        >
          Request New Magic Link
        </Button>
      </Box>
    </Paper>
  );
};

export default VerifyToken;
