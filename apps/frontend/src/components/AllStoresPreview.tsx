import React from 'react';
import { storesConfig } from '../config/store.config';
import type { StoreConfig } from '../types/StoreConfig';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';

const StoreCard = ({ store }: { store: StoreConfig }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        sx={{
          p: 2,
          borderRadius: 4,
          boxShadow: 4,
          fontFamily: store.font,
          bgcolor: 'background.paper',
          color: 'text.primary',
          textAlign: 'center',
          height: '100%',
        }}
      >
        <CardContent>
          <Box mb={2}>
            <Box
              component="img"
              src={store.logoUrl}
              alt={store.storeName}
              sx={{ height: 50, mb: 1, borderRadius: 1, objectFit: 'contain' }}
            />
            <Typography variant="h6" fontWeight={600}>
              {store.storeName}
            </Typography>
          </Box>
          <Typography variant="body2">💸 {store.currency}</Typography>
          <Typography variant="body2">🧩 {store.layout}</Typography>
          <Typography variant="body2">🌓 {store.mode}</Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: store.primaryColor,
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { bgcolor: store.primaryColor, opacity: 0.9 },
              }}
              href={`/?store=${store.storeId}`}
            >
              Preview
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AllStoresPreview = () => {
  return (
    <Box mt={4} px={2}>
      <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
        🧪 Store Theme Previews
      </Typography>
      <Grid container spacing={3}>
        {Object.values(storesConfig).map((store) => (
          <Grid key={store.storeId} item xs={12} sm={6} md={4}>
            <StoreCard store={store} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllStoresPreview;
