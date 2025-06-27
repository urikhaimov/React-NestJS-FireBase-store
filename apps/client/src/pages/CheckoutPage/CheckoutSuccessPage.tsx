// src/pages/CheckoutSuccessPage.tsx
import { Typography, Box } from '@mui/material';

export default function CheckoutSuccessPage() {
  return (
    <Box sx={{ mt: 6, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        🎉 Payment Successful!
      </Typography>
      <Typography>Your order is being processed. Thank you!</Typography>
    </Box>
  );
}
