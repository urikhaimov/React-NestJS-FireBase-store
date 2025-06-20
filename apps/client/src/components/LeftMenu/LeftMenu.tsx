// src/components/LeftMenu/LeftMenu.tsx
import React, { useEffect } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BrushIcon from '@mui/icons-material/Brush';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../store/cartStore';
import CartDrawer from '../CartDrawer';
import { useSidebarStore } from '../../stores/useSidebarStore';

export default function LeftMenu() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    mobileOpen,
    expanded,
    cartOpen,
    anchorEl,
    setExpanded,
    toggleMobileDrawer,
    closeMobileDrawer,
    openCartDrawer,
    closeCartDrawer,
    setAnchorEl,
  } = useSidebarStore();

  const drawerWidth = expanded ? 240 : 72;
  const showLabel = expanded && !isMobile;

  useEffect(() => {
    setExpanded(!isMobile);
  }, [isMobile, setExpanded]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () =>
    setAnchorEl(null);

  const storeLinks = [
    { label: 'Home', icon: <HomeIcon />, action: () => navigate('/') },
    {
      label: 'Cart',
      icon: (
        <Badge badgeContent={cartCount} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      ),
      action: () => openCartDrawer(),
    },
    { label: 'My Orders', icon: <InventoryIcon />, action: () => navigate('/my-orders') },
    { label: 'Profile', icon: <AccountCircleIcon />, action: () => navigate('/profile') },
  ];

  const adminLinks = [
    { label: 'Dashboard Home', icon: <AdminPanelSettingsIcon />, path: '/admin' },
    { label: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
    { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { label: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
    { label: 'Orders', icon: <ReceiptIcon />, path: '/admin/orders' },
    { label: 'Theme', icon: <BrushIcon />, path: '/admin/theme' },
  ];

  const drawerContent = (
    <Box width={drawerWidth} display="flex" flexDirection="column" height="100%">
      {!isMobile && (
        <IconButton onClick={() => setExpanded(!expanded)} sx={{ m: 1 }}>
          <MenuIcon />
        </IconButton>
      )}

      <Divider />

      {user && (
        <Box display="flex" alignItems="center" gap={1} p={2} sx={{ cursor: 'pointer' }} onClick={handleProfileMenuOpen}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {user.name?.[0] || user.email?.[0] || 'U'}
          </Avatar>
          {showLabel && (
            <Typography variant="subtitle2" noWrap>
              {user.name || user.email}
            </Typography>
          )}
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>Edit Profile</MenuItem>
        <MenuItem onClick={() => { logout(); handleProfileMenuClose(); }}>Logout</MenuItem>
      </Menu>

      <Divider />
      <List>
        {storeLinks.map(({ label, icon, action }) => (
          <Tooltip title={!showLabel ? label : ''} placement="right" key={label}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  action();
                  if (isMobile) closeMobileDrawer();
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                {showLabel && <ListItemText primary={label} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {isAdmin && (
        <>
          <Divider />
          <List>
            {adminLinks.map(({ label, icon, path }) => (
              <Tooltip title={!showLabel ? label : ''} placement="right" key={label}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(path);
                      if (isMobile) closeMobileDrawer();
                    }}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    {showLabel && <ListItemText primary={label} />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </>
      )}

      <Box flexGrow={1} />

      <List>
        <Tooltip title={!showLabel ? 'Logout' : ''} placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              {showLabel && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={closeMobileDrawer}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            zIndex: (theme) => theme.zIndex.drawer + 2,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
            },
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <CartDrawer open={cartOpen} onClose={closeCartDrawer} />
    </>
  );
}
