import React, { useContext } from 'react';
import { StoreConfigContext } from '../context/StoreConfigContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const StorePreview = () => {
  const store = useContext(StoreConfigContext);
  const {
    storeName,
    logoUrl,
    primaryColor,
    font,
    currency,
    layout,
    mode,
  } = store;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 460,
          mx: 'auto',
          mt: 5,
          p: 3,
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderRadius: 4,
          boxShadow: 8,
          fontFamily: font,
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Box
              component="img"
              src={logoUrl}
              alt={storeName}
              sx={{
                height: 60,
                objectFit: 'contain',
                borderRadius: 2,
                boxShadow: 1,
              }}
            />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {storeName}
            </Typography>
          </Box>

          <Box mt={3} display="grid" gap={1}>
            <Typography variant="body2">🪙 Currency: <strong>{currency}</strong></Typography>
            <Typography variant="body2">🧩 Layout: <strong>{layout}</strong></Typography>
            <Typography variant="body2">🌙 Mode: <strong>{mode}</strong></Typography>
          </Box>

          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: primaryColor,
                borderRadius: 3,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: primaryColor,
                  opacity: 0.9,
                },
              }}
            >
              Sample Button
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StorePreview;
