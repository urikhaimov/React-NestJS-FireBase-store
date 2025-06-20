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
import { useSidebarStore } from '../../stores/useSidebarStore'; // Create Zustand store or use your reducer

const Header: React.FC = () => {
  const { user } = useSafeAuth();
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));

  const { storeId, setStoreId } = useStoreSettings();
  const [showToast, setShowToast] = useState(false);

  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const { toggleMobileDrawer } = useSidebarStore(); // 👈 Inject your Zustand or reducer action

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
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {/* LEFT: Menu icon only on mobile */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* RIGHT: Title */}
        <Typography variant="h6" fontWeight="bold" noWrap>
          My Online Store
        </Typography>
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
