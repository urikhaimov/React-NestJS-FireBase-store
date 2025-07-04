// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../../firebase';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import LoadingProgress from '../../components/LoadingProgress';
import type { LandingPageData } from '../../types/landing';

const HomePage: React.FC = () => {
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);

  useEffect(() => {
    const fetchLanding = async () => {
      try {
        const ref = doc(db, 'landingPages', 'default');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setLandingData(snap.data() as LandingPageData);
        }
      } catch (error) {
        console.error('Failed to load landing page data:', error);
      }
    };
    fetchLanding();
  }, []);

  if (!landingData) {
    return (
      
        <LoadingProgress />
     
    );
  }

  return (
    <PageWithStickyFilters>
      <Box textAlign="center" mt={4} mb={6}>
        {landingData.title && (
          <Typography variant="h4" gutterBottom>
            {landingData.title}
          </Typography>
        )}

        {landingData.subtitle && (
          <Typography variant="subtitle1" gutterBottom>
            {landingData.subtitle}
          </Typography>
        )}

        {landingData.bannerImageUrl && (
          <Box my={2}>
            <img
              src={landingData.bannerImageUrl}
              alt="Banner"
              style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
            />
          </Box>
        )}

        {landingData.ctaButtonText && (
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to={landingData.ctaButtonLink || '/products'}
            >
              {landingData.ctaButtonText}
            </Button>
          </Box>
        )}
      </Box>

      {/* Optional: Render section previews */}
      {landingData.sections && landingData.sections.length > 0 && (
        <Box>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Featured Sections
          </Typography>
          {/* You could map here actual sections or component previews */}
          {landingData.sections.map((section, index) => (
            <Box key={index} my={2}>
              <Typography variant="subtitle1">{section.title}</Typography>
              {section.subtitle && (
                <Typography variant="body2">{section.subtitle}</Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Future section */}
      <Box mt={6} textAlign="center">
        <Typography variant="h4" gutterBottom>
          🛍️ Best Sellers
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to="/products"
        >
          View All Products
        </Button>
      </Box>
    </PageWithStickyFilters>
  );
};

export default HomePage;
