import { Typography, Box } from '@mui/material';

export default function CheckoutSuccessPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)', // Adjust if you have a persistent header
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        🎉 Payment Successful!
      </Typography>
      <Typography>Your order is being processed. Thank you!</Typography>
    </Box>
  );
}
