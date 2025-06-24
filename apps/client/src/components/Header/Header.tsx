// src/components/Header/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Snackbar,
  Alert,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { useSafeAuth } from '../../hooks/useAuth';
import { useStoreSettings } from '../../stores/useStoreSettings';
import { useCartStore } from '../../store/cartStore';
import { useSidebarStore } from '../../stores/useSidebarStore';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user } = useSafeAuth();
  const { storeId, setStoreId } = useStoreSettings();
  const [showToast, setShowToast] = useState(false);
  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const { toggleMobileDrawer } = useSidebarStore();

  const handleStoreChange = (newId: string) => {
    setStoreId(newId);
    setShowToast(true);
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 'none',
        px: { xs: 0, sm: 3 }, // remove horizontal padding on mobile
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', minHeight: 56 }}>
        {/* LEFT: Hamburger menu for mobile */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileDrawer}
            sx={{ ml: 0 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* MIDDLE: Logo or title */}
        <Typography variant="h6" fontWeight="bold" noWrap component="div">
          My Online Store
        </Typography>

        {/* RIGHT: Placeholder or future action (optional) */}
        <Box sx={{ width: 40 }} />
      </Toolbar>

      <Snackbar
        open={showToast}
        autoHideDuration={1000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Theme updated for store: <strong>{storeId}</strong>
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Header;
