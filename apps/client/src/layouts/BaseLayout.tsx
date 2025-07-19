// src/layouts/BaseLayout.tsx
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer';
import ScrollContainer from '../components/ScrollContainer';
import LeftMenu from '../components/LeftMenu/LeftMenu';
import { footerHeight, sidebarWidth , } from '../config/themeConfig';

interface BaseLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function BaseLayout({
  children,
  showFooter = true,
}: BaseLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <Header />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {isMobile ? (
          <LeftMenu />
        ) : (
          <ScrollContainer sx={{ width: sidebarWidth }}>
            <LeftMenu />
          </ScrollContainer>
        )}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            position: 'relative',
          }}
        >
          {children}
        </Box>
      </Box>

      {showFooter && !isMobile && (
        <Box sx={{ height: `${footerHeight}px`, flexShrink: 0 }}>
          <Footer />
        </Box>
      )}
    </Box>
  );
}
