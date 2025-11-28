import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import { authApi } from '../../services/authApi';
import { useAuth } from '../../hooks/useAuth';

interface CodeEntryFormProps {
  email: string;
  rememberMe?: boolean;
  onSuccess: () => void;
  onBack: () => void;
}

const CodeEntryForm: React.FC<CodeEntryFormProps> = ({ email, rememberMe = true, onSuccess, onBack }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const { checkAuthStatus } = useAuth();

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Remove timeLeft from dependencies to prevent timer restart

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authApi.verifyCode(email, code, rememberMe);
      // Update auth context to recognize the new session
      await checkAuthStatus();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      await authApi.login(email, rememberMe);
      setTimeLeft(15 * 60);
      setIsExpired(false);
      setCode('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (timeLeft / (15 * 60)) * 100;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Enter Verification Code
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We sent a 6-digit code to <strong>{email}</strong>
        </Typography>
      </Box>

      {/* Timer Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Code expires in:
          </Typography>
          <Typography 
            variant="body2" 
            color={timeLeft < 300 ? 'error' : 'text.secondary'} // Red if less than 5 minutes
            sx={{ fontWeight: 'bold' }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          color={timeLeft < 300 ? 'error' : 'primary'}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {isExpired && (
        <Alert severity="error" sx={{ mb: 3 }}>
          The verification code has expired. Please request a new one.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="6-digit code"
          value={code}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setCode(value);
          }}
          placeholder="123456"
          disabled={loading || isExpired}
          inputProps={{
            style: { 
              textAlign: 'center', 
              fontSize: '1.5rem', 
              letterSpacing: '0.5rem',
              fontFamily: 'monospace'
            }
          }}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading || code.length !== 6 || isExpired}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Verify Code'}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleResendCode}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          Resend Code
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={onBack}
          disabled={loading}
        >
          Back to Login
        </Button>
      </form>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Didn't receive the email? Check your spam folder or try again.
        </Typography>
      </Box>
    </Paper>
  );
};

export default CodeEntryForm;
