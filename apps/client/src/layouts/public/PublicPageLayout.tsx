// src/layouts/public/PublicPageLayout.tsx
import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

export default function PublicPageLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Topbar already renders at the app level */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
