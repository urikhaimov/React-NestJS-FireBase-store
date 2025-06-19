// src/components/LeftMenu.tsx
import React, { useState } from 'react';
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
import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../store/cartStore';
import CartDrawer from './CartDrawer';

export default function LeftMenu() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = expanded ? 240 : 72;

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const storeLinks = [
    { label: 'Home', icon: <HomeIcon />, action: () => navigate('/') },
    {
      label: 'Cart',
      icon: (
        <Badge badgeContent={cartCount} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      ),
      action: () => setCartOpen(true),
    },
    { label: 'My Orders', icon: <InventoryIcon />, action: () => navigate('/my-orders') },
    { label: 'Profile', icon: <AccountCircleIcon />, action: () => navigate('/profile') },
  ];

 const adminLinks = [
  { label: 'Dashboard Home', icon: <AdminPanelSettingsIcon />, path: '/admin' },
  { label: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
  { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { label: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
  { label: 'Orders', icon: <ReceiptIcon />, path: '/admin/orders' }, // ✅ unique icon
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
          {expanded && (
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
          <Tooltip title={!expanded ? label : ''} placement="right" key={label}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { action(); if (isMobile) setMobileOpen(false); }}>
                <ListItemIcon>{icon}</ListItemIcon>
                {expanded && <ListItemText primary={label} />}
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
              <Tooltip title={!expanded ? label : ''} placement="right" key={label}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => { navigate(path); if (isMobile) setMobileOpen(false); }}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    {expanded && <ListItemText primary={label} />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </>
      )}

      <Box flexGrow={1} />

      <List>
        <Tooltip title={!expanded ? 'Logout' : ''} placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              {expanded && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            color="inherit"
            onClick={toggleDrawer}
            sx={{ position: 'fixed', top: 10, left: 10, zIndex: 1400 }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
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

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}