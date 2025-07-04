import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Container,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../../firebase';
import LoadingProgress from '../../components/LoadingProgress';
import BestSellers from '../../components/BestSellers';
import type { LandingPageData } from '../../types/landing';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  if (!landingData) return <LoadingProgress />;

  const sections = landingData.sections ?? [];

  return (
    <PageWithStickyFilters>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header Content */}
        <Box
          textAlign="center"
          sx={{
            px: isMobile ? 1 : 3,
            overflowX: 'hidden',
          }}
        >
          {landingData.title && (
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {landingData.title}
            </Typography>
          )}

          {landingData.subtitle && (
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {landingData.subtitle}
            </Typography>
          )}

          {landingData.bannerImageUrl && (
            <Box
              mt={2}
              sx={{
                maxHeight: { xs: 200, md: 300 },
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <img
                src={landingData.bannerImageUrl}
                alt="Banner"
                style={{
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            </Box>
          )}

          {landingData.ctaButtonText && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              component={Link}
              to={landingData.ctaButtonLink || '/products'}
            >
              {landingData.ctaButtonText}
            </Button>
          )}
        </Box>

        {/* Sections */}
        {sections.length > 0 && (
          <Box mt={6}>
            <Typography variant="h5" textAlign="center" gutterBottom>
              🧩 Featured Sections
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {sections.map((section, index) => (
                <Box key={index}>
                  {section.title && (
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {section.title}
                    </Typography>
                  )}

                  {section.subtitle && (
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {section.subtitle}
                    </Typography>
                  )}

                  {section.content && (
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: 'pre-wrap' }}
                    >
                      {section.content}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Best Sellers */}
        <Box mt={6}>
          <BestSellers />
        </Box>
      </Container>
    </PageWithStickyFilters>
  );
}
