import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Filament } from './types/filament';
import { filamentApi } from './services/api';
import FilamentForm from './components/FilamentForm';
import FilamentTable from './components/FilamentTable';
import NotesSection from './components/NotesSection';
import ThemeToggle from './components/ThemeToggle';
import AppLogo from './components/AppLogo';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { Alert, Snackbar } from '@mui/material';

function App() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Load filaments on component mount
  useEffect(() => {
    loadFilaments();
  }, []);

  const loadFilaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await filamentApi.getAll();
      setFilaments(data);
    } catch (err) {
      setError('Failed to load filaments');
      console.error('Error loading filaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilamentAdded = (newFilament: Filament) => {
    setFilaments(prev => [...prev, newFilament]);
    setSuccessMessage(`Added ${newFilament.brand} ${newFilament.filamentType} ${newFilament.color}`);
  };

  const handleFilamentUpdated = (updatedFilament: Filament) => {
    setFilaments(prev => 
      prev.map(f => f.id === updatedFilament.id ? updatedFilament : f)
    );
    setSuccessMessage(`Updated ${updatedFilament.brand} ${updatedFilament.filamentType} ${updatedFilament.color}`);
  };

  const handleFilamentDeleted = (deletedId: string) => {
    const deletedFilament = filaments.find(f => f.id === deletedId);
    setFilaments(prev => prev.filter(f => f.id !== deletedId));
    if (deletedFilament) {
      setSuccessMessage(`Deleted ${deletedFilament.brand} ${deletedFilament.filamentType} ${deletedFilament.color}`);
    }
  };

  const handleFilamentReduced = (updatedFilament: Filament) => {
    setFilaments(prev => 
      prev.map(f => f.id === updatedFilament.id ? updatedFilament : f)
    );
    setSuccessMessage(`Reduced amount for ${updatedFilament.brand} ${updatedFilament.filamentType} ${updatedFilament.color}`);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getPageContent = () => {
    switch (activeTab) {
      case 0:
        return {
          title: 'Filament Inventory',
          description: 'Manage your filament inventory and keep track of important notes'
        };
      case 1:
        return {
          title: 'Notes & Helpers',
          description: 'Add notes, tips, and helpful information for your 3D printing projects'
        };
      default:
        return {
          title: 'FilamentFlow',
          description: 'Your 3D printer filament management solution'
        };
    }
  };

  const { title, description } = getPageContent();

  return (
    <>
      <CssBaseline />
      <AppBar position="static" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <AppLogo size="medium" variant="horizontal" />
            <Box sx={{ flexGrow: 1 }} />
            <ThemeToggle />
          </Toolbar>
        </Container>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, userSelect: 'none' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ userSelect: 'none', cursor: 'default' }}>
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ userSelect: 'none', cursor: 'default' }}>
            {description}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="main navigation tabs">
            <Tab label="Filament Inventory" />
            <Tab label="Notes & Helpers" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <>
            <Box sx={{ mb: 4 }}>
              <FilamentForm 
                onFilamentAdded={handleFilamentAdded}
                onError={setError}
              />
            </Box>

            <FilamentTable
              filaments={filaments}
              loading={loading}
              onFilamentUpdated={handleFilamentUpdated}
              onFilamentDeleted={handleFilamentDeleted}
              onFilamentReduced={handleFilamentReduced}
              onError={setError}
            />
          </>
        )}

        {activeTab === 1 && (
          <NotesSection onError={setError} />
        )}

        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default App;
