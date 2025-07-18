// src/components/LoadingProgress.tsx
import { Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { sidebarWidth } from '../config/themeConfig';

const LoadingProgress = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        width: '60vw',
        overflowX: 'hidden',
        ml: isMobile ? 0 : `${sidebarWidth}px`,
        position: 'relative',
        maxWidth: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingProgress;
