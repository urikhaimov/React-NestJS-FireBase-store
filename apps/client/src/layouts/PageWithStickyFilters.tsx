// PageWithStickyFilters.tsx
import React from 'react';
import { Box } from '@mui/material';

export default function PageWithStickyFilters({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 2, md: 4 },
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'clac(100vh - 264px)', // Adjust based on your header/footer height
        overflowX: 'hidden',
        mx: 'auto',
        mt: 10,
        position: 'relative',
        scrollbarWidth: 'thin', // Firefox
        scrollbarColor: '#888 #2c2c2c', // Firefox
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#2c2c2c',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '8px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#aaa',
        },
      }}
    >

      {children}
    </Box>
  );
}
