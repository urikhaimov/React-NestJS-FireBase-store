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

const drawerWidth = 240;

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
          p: 10,
          width: `calc(100vw - ${drawerWidth}px)`,
        }}
      >
      
          <Outlet />
      </Box>
    </Box>



  );
}
