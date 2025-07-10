import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      textAlign="center"
      px={2}
    >
      <Typography variant="h3" gutterBottom>
        🎉 Thank You for Your Order!
      </Typography>
      <Typography variant="h6" mb={4}>
        We've received your payment and your order is being processed.
      </Typography>

      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go to Home
        </Button>
        <Button variant="outlined" onClick={() => navigate('/my-orders')}>
          View My Orders
        </Button>
      </Box>
    </Box>
  );
}
