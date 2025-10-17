import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import LoginForm from './components/auth/LoginForm';
import VerifyToken from './components/auth/VerifyToken';
import MainApp from './components/MainApp';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
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
      </Router>
    </AuthProvider>
  );
}

export default App;