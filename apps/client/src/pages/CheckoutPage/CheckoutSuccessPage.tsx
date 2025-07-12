import {
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useConfirmOrder } from '../../hooks/useConfirmOrder';

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const { loading, toastOpen, setToastOpen, error } = useConfirmOrder();

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 480, textAlign: 'center' }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Payment Successful 🎉
            </Typography>
            <Typography variant="body1" gutterBottom>
              Thank you for your order.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </>
        )}
      </Paper>

      <Snackbar
        open={toastOpen}
        autoHideDuration={5000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Cart cleared. Order saved!
        </Alert>
      </Snackbar>
    </Box>
  );
}
