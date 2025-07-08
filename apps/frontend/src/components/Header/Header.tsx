// src/components/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useSafeAuth } from '../../hooks/useAuth';
import { useStoreSettings } from '../../stores/useStoreSettings';
import { useCartStore } from '../../store/cartStore';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useThemeStore } from '../../store/themeStore';

const DEFAULT_AVATAR = '/default-avatar.png';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user } = useSafeAuth();
  const { storeId, setStoreId } = useStoreSettings();
  const [showStoreToast, setShowStoreToast] = useState(false);
  const [showThemeToast, setShowThemeToast] = useState(false);

  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const { toggleMobileDrawer } = useSidebarStore();
  const { toggleDarkMode, themeSettings } = useThemeStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleStoreChange = (newId: string) => {
    setStoreId(newId);
    setShowStoreToast(true);
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleToggleDarkMode = async () => {
    await toggleDarkMode();
    setShowThemeToast(true);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 'none',
        px: { xs: 0, sm: 3 },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', minHeight: 56 }}>
        {/* LEFT: Hamburger menu and store name */}
        <Box display="flex" alignItems="center">
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileDrawer}
              sx={{ ml: 0, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight="bold" noWrap component="div">
            {themeSettings.storeName || 'My Store'}
          </Typography>
        </Box>

        {/* RIGHT: Icons and avatar */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton color="inherit" onClick={handleToggleDarkMode}>
            <Brightness4Icon />
          </IconButton>

          <IconButton color="inherit">
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {user && (
            <IconButton onClick={handleMenuClick} color="inherit">
              <Avatar
                src={user.photoURL || DEFAULT_AVATAR}
                alt={user.name || user.email || 'User'}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          )}

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>{user?.name || user?.email}</MenuItem>
            <MenuItem onClick={() => (window.location.href = '/profile')}>Profile</MenuItem>
            <MenuItem onClick={() => (window.location.href = '/logout')}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Toast for store switch */}
      <Snackbar
        open={showStoreToast}
        autoHideDuration={1000}
        onClose={() => setShowStoreToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Theme updated for store: <strong>{storeId}</strong>
        </Alert>
      </Snackbar>

      {/* Toast for dark mode toggle */}
      <Snackbar
        open={showThemeToast}
        autoHideDuration={1200}
        onClose={() => setShowThemeToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {themeSettings.darkMode ? 'Dark Mode Enabled 🌙' : 'Light Mode Enabled ☀️'}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Header;
