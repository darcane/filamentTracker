import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import LoginForm from './components/auth/LoginForm';
import VerifyToken from './components/auth/VerifyToken';
import MainApp from './components/MainApp';
import CookieConsentBanner from './components/consent/CookieConsentBanner';
import { AuthProvider } from './contexts/AuthContext';
import { CookieConsentProvider, useCookieConsent } from './contexts/CookieConsentContext';

const AppContent: React.FC = () => {
  const { updateConsent } = useCookieConsent();

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/auth/verify" element={<VerifyToken />} />
        <Route 
          path="/" 
          element={
            <MainApp />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsentBanner onConsentChange={updateConsent} />
    </>
  );
};

function App() {
  return (
    <CookieConsentProvider>
      <AuthProvider>
        <Router>
          <CssBaseline />
          <AppContent />
        </Router>
      </AuthProvider>
    </CookieConsentProvider>
  );
}

export default App;