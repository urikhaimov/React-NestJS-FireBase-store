import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // You missed this import
import { db } from '../../firebase'; // Adjust path as needed
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import LoadingProgress from '../../components/LoadingProgress';

const HomePage: React.FC = () => {
  const [landingData, setLandingData] = useState<any>(null);

  useEffect(() => {
    const fetchLanding = async () => {
      const ref = doc(db, 'landingPages', 'default');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setLandingData(snap.data());
      }
    };
    fetchLanding();
  }, []);

  return (
    <PageWithStickyFilters>
      <Box textAlign="center" mt={4} mb={2}>
        {landingData ? (
          <>
            <Typography variant="h4" align="center" gutterBottom>
              {landingData.title}
            </Typography>

            <Typography variant="subtitle1" align="center" gutterBottom>
              {landingData.subtitle}
            </Typography>

            {landingData.bannerImageUrl && (
              <Box my={2}>
                <img
                  src={landingData.bannerImageUrl}
                  alt="Banner"
                  style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
                />
              </Box>
            )}

            {landingData.ctaButtonText && (
              <Box mt={2}>
                <Button
                  variant="contained"
                  component={Link}
                  to={landingData.ctaButtonLink || '/'}
                >
                  {landingData.ctaButtonText}
                </Button>
              </Box>
            )}

            {/* Add spacing before best sellers section */}
            <Box mt={6}>
              <Typography variant="h4" gutterBottom>
                🛍️ Best Sellers
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/products"
              >
                View All Products
              </Button>
            </Box>
          </>
        ) : (
          <LoadingProgress />
        )}
      </Box>

      {/* 🔻 Future: Render actual best sellers component */}
      {/* <BestSellers /> */}
    </PageWithStickyFilters>
  );
};

export default HomePage;
