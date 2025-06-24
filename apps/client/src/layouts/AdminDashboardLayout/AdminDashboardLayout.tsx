// ✅ src/layouts/AdminDashboardLayout.tsx
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import {drawerWidth}  from '../../constants/globalConstants'


export default function AdminDashboardLayout() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: { xs: '100%', sm: `calc(100vw - ${drawerWidth}px)` },
        overflow: 'hidden',
        m: 0,
        p: 0,
      }}
    >
      <CssBaseline />

      {/* Sidebar Navigation */}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          m: 0,
          px: { xs: 0, sm: 3 }, // ✅ remove left/right padding on mobile
          py: { xs: 1, sm: 3 },
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
