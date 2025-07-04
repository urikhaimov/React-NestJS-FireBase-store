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
        py: 10,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // ✅ Ensures full page height
        overflowY: 'auto',  // ✅ Enables scroll when content exceeds height
      }}
    >
      {children}
    </Box>
  );
}
