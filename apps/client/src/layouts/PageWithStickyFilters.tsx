import React from 'react';
import { Box } from '@mui/material';

export default function PageWithStickyFilters({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        mx: 'auto',
        width: '100%',
        maxWidth: '1200px',
        px: 2,
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%', // ✅ allow scrollable growth
      }}
    >
      {children}
    </Box>
  );
}
