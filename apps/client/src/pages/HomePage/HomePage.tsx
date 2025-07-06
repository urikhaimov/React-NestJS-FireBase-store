import  { useEffect, useState } from 'react';
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
import { motion } from 'framer-motion';

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
        console.error('❌ Failed to load landing page data:', error);
      }
    };

    fetchLanding();
  }, []);

  if (!landingData) return <LoadingProgress />;

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
              {/* Background Image */}
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
                   opacity: 0.5, // 👈 subtle dimming
                }}
              />

              {/* Soft Dark Overlay for the whole image */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.25)', // <- subtle opacity
                  zIndex: 1,
                }}
              />

              {/* Title and Subtitle */}
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

            {/* CTA Button Below Banner */}
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
              <Divider sx={{ mb: 3 }} />
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
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
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
