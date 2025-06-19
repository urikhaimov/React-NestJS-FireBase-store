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
import LeftMenu from '../../components/LeftMenu';

const drawerWidth = 240;

export default function AdminDashboardLayout() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: 'flex', height: '70vh', overflow: 'hidden' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ minHeight: 48, px: 2 }}>
          {(isMobile || isTablet) && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" fontSize={18} noWrap>
            My Online Store
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="admin menu"
      >
        <Drawer
          variant={isMobile || isTablet ? 'temporary' : 'permanent'}
          open={isMobile || isTablet ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <LeftMenu />
        </Drawer>
      </Box>

      {/* Sticky Filter + Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
          pt: 6,
          px: 2,
          pb: 1,
          overflowY: 'hidden',
        }}
      >

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '90vh',
            overflow: 'hidden', // prevent double scrollbars
            width: {
              xs: '100%',
              sm: `calc(100% - ${drawerWidth}px)`,
            },
            pt: { xs: 1.5, sm: 3 },
            px: { xs: 1.5, sm: 3 },
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
}
