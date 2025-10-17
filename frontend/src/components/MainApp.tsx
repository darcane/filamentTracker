import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { Filament } from '../types/filament';
import { filamentApi } from '../services/api';
import FilamentForm from './FilamentForm';
import FilamentTable from './FilamentTable';
import NotesSection from './NotesSection';
import ThemeToggle from './ThemeToggle';
import AppLogo from './AppLogo';
import LogoutButton from './auth/LogoutButton';
import { Alert, Snackbar } from '@mui/material';
import { useResponsive } from '../hooks/useMediaQuery';
import { useAuth } from '../hooks/useAuth';

const MainApp: React.FC = () => {
  return (
    <ProtectedRoute>
      <MainAppContent />
    </ProtectedRoute>
  );
};

const MainAppContent: React.FC = () => {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Load filaments on component mount
  useEffect(() => {
    loadFilaments();
  }, []);

  const loadFilaments = async () => {
    try {
      setLoading(true);
      const data = await filamentApi.getAll();
      setFilaments(data);
    } catch (error) {
      setError('Failed to load filaments');
      console.error('Error loading filaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilamentAdded = (filament: Filament) => {
    setFilaments(prev => [filament, ...prev]);
    setSuccessMessage(`${filament.brand} ${filament.filamentType} added successfully!`);
  };

  const handleFilamentUpdated = (updatedFilament: Filament) => {
    setFilaments(prev => 
      prev.map(f => f.id === updatedFilament.id ? updatedFilament : f)
    );
    setSuccessMessage('Filament updated successfully!');
  };

  const handleFilamentDeleted = (id: string) => {
    setFilaments(prev => prev.filter(f => f.id !== id));
    setSuccessMessage('Filament deleted successfully!');
  };

  const handleFilamentReduced = (updatedFilament: Filament) => {
    setFilaments(prev => 
      prev.map(f => f.id === updatedFilament.id ? updatedFilament : f)
    );
    setSuccessMessage(`Filament amount reduced to ${updatedFilament.amount}g`);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDrawerTabChange = (newValue: number) => {
    setActiveTab(newValue);
    setDrawerOpen(false);
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
          title: 'Filamentory',
          description: 'Your 3D printer filament management solution'
        };
    }
  };

  const { title, description } = getPageContent();

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
            {isMobile || isTablet ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <AppLogo size="xsmall" variant="horizontal" />
              </>
            ) : (
              <>
                <AppLogo size="medium" variant="horizontal" />
                <Box sx={{ flexGrow: 1 }} />
                <ThemeToggle />
                <LogoutButton />
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile/Tablet Drawer */}
      {(isMobile || isTablet) && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AppLogo size="small" variant="horizontal" />
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={activeTab === 0}
                onClick={() => handleDrawerTabChange(0)}
              >
                <ListItemText primary="Filament Inventory" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={activeTab === 1}
                onClick={() => handleDrawerTabChange(1)}
              >
                <ListItemText primary="Notes & Helpers" />
              </ListItemButton>
            </ListItem>
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ p: 2 }}>
            <ThemeToggle />
            <Box sx={{ mt: 2 }}>
              <LogoutButton />
            </Box>
          </Box>
        </Drawer>
      )}

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, userSelect: 'none' }}>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h1"
            gutterBottom
            sx={{ userSelect: 'none', cursor: 'default' }}
          >
            {title}
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'subtitle1'}
            color="text.secondary"
            sx={{ userSelect: 'none', cursor: 'default' }}
          >
            {description}
          </Typography>
        </Box>

        {/* Desktop Tabs - Hidden on mobile/tablet */}
        {isDesktop && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="main navigation tabs">
              <Tab label="Filament Inventory" />
              <Tab label="Notes & Helpers" />
            </Tabs>
          </Box>
        )}

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
          anchorOrigin={{
            vertical: isMobile ? 'top' : 'bottom',
            horizontal: 'center'
          }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: isMobile ? 'top' : 'bottom',
            horizontal: 'center'
          }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default MainApp;
