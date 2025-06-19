// src/components/Navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

import CartButton from './CartButton';
import { useAuthStore, useIsAdmin  } from '../stores/useAuthStore';
const Navbar = () => {
  const { user, logout} = useAuthStore();
const isAdmin = useIsAdmin();
  return (
    <AppBar position="sticky" sx={{ zIndex: 1300 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
       
        <Box display="flex" alignItems="center" gap={1}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/cart">Cart</Button>
          <Button color="inherit" component={Link} to="/checkout">Checkout</Button>
          {user && <Button color="inherit" component={Link} to="/my-orders">My Orders</Button>}
          {isAdmin && <Button color="inherit" component={Link} to="/admin">Admin</Button>}
          {user ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </>
          )}
          <CartButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
