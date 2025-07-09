import React from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useLandingPage } from '../../hooks/useLandingPage';
import LoadingProgress from '../../components/LoadingProgress';
import BestSellers from '../../components/BestSellers';
import type { LandingPageData } from '../../types/landing';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading, isError } = useLandingPage();
 

  if (isLoading) return <LoadingProgress />;
  if (isError)
    return (
      <Typography color="error" textAlign="center" mt={6}>
        Failed to load landing page data.
      </Typography>
    );

  // Defensive fallback for data properties
  const landingData: LandingPageData = data ?? {
    title: '',
    subtitle: '',
    bannerImageUrl: '',
    ctaButtonText: '',
    ctaButtonLink: '',
    sections: [],
  };

  const sections = landingData.sections ?? [];

  return (
    <PageWithStickyFilters>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Banner Section */}
        {landingData.bannerImageUrl && (
          <>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 7',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 2,
              }}
            >
              <Box
                component="img"
                src={landingData.bannerImageUrl}
                alt="Banner"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                  opacity: 0.5,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  zIndex: 1,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  px: 2,
                  pt: 6,
                  zIndex: 2,
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                {landingData.title && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Typography variant="h1" fontWeight="bold" gutterBottom>
                      {landingData.title}
                    </Typography>
                  </motion.div>
                )}
                {landingData.subtitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                  >
                    <Typography variant="h2">{landingData.subtitle}</Typography>
                  </motion.div>
                )}
              </Box>
            </Box>

            {landingData.ctaButtonText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                style={{ textAlign: 'center', marginBottom: '2rem' }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={Link}
                  to={landingData.ctaButtonLink || '/products'}
                >
                  {landingData.ctaButtonText}
                </Button>
              </motion.div>
            )}
          </>
        )}

        {/* Featured Sections */}
        {sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Box mb={6}>
              <Typography variant="h5" textAlign="center" gutterBottom>
                🧩 Featured Sections
              </Typography>
              <Box display="flex" flexDirection="column" gap={4}>
                {sections.map((section, index) => (
                  <motion.div
                   key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    viewport={{ once: true }}
                  >
                    <Box>
                      {section.title && (
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {section.title}
                        </Typography>
                      )}
                      {section.subtitle && (
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {section.subtitle}
                        </Typography>
                      )}
                      {section.content && (
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {section.content}
                        </Typography>
                      )}
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Best Sellers */}
        <BestSellers />
      </Container>
    </PageWithStickyFilters>
  );
}
