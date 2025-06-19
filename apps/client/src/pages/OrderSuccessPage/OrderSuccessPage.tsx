import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, items, total } = location.state || {};

  // If no state passed, redirect back
  useEffect(() => {
    if (!orderNumber) {
      navigate('/');
    }
  }, [orderNumber, navigate]);

  return (
    <PageWithStickyFilters>
      <Typography variant="h4" gutterBottom align="center">
        🎉 Thank you for your order!
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Your payment was successful. Here’s your order summary.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Order Number: #{orderNumber}
      </Typography>

      <List sx={{ mt: 2 }}>
        {items?.map((item: any) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={`${item.name} × ${item.quantity}`}
              secondary={`$${item.price.toFixed(2)} each`}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Total: ${total?.toFixed(2)}</Typography>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="contained" color="primary" component={Link} to="/">
          Return to Home
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to="/my-orders"
          sx={{ ml: 2 }}
        >
          View My Orders
        </Button>
      </Box>
    </PageWithStickyFilters>
  );
};
export default OrderSuccessPage;