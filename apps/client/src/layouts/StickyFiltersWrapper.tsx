import { Box, Typography } from '@mui/material';
import React from 'react';

interface AdminStickyPageProps {
  title: string;
  filters?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminStickyPage({ title, filters, children }: AdminStickyPageProps) {
  return (
    <Box px={2} py={2}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      {filters && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 2,
            mb: 2,
          }}
        >
          {filters}
        </Box>
      )}

      <Box>{children}</Box>
    </Box>
  );
}